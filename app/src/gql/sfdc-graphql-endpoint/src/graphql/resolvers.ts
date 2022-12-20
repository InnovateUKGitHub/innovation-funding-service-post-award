import assert from 'assert';
import {
    assertObjectType,
    FieldNode,
    FragmentSpreadNode,
    getNamedType,
    GraphQLField,
    GraphQLFieldResolver,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLResolveInfo,
    InlineFragmentNode,
    Kind,
    SelectionSetNode,
    valueFromAST,
} from 'graphql';
import { Api } from '../sfdc/api';
import { Connection } from '../sfdc/connection';
import {
    Entity,
    isPolymorphicReference,
    isReferenceField,
    isScalarField,
    SfdcSchema,
} from '../sfdc/schema';
import {
    queryToString,
    SOQLComparisonOperator,
    SOQLConditionExpr,
    SOQLConditionExprType,
    SOQLFieldExpr,
    SOQLFieldType,
    SOQLLogicalOperator,
    SOQLOrderByItem,
    SOQLQuery,
    SOQLSelect,
    SOQLSortingOrder,
} from '../sfdc/soql';
import { Logger } from '../utils/logger';
import { fieldNameNormalise } from '../utils/nameNormaliser';
import { Resolvers } from './schema';
import { GraphQLSortOrderValue } from './types';

export interface ResolverContext {
    connection: Connection;
    api: Api;
    logger?: Logger;
}

type SOQLQueryOptionals = Pick<SOQLQuery, 'where' | 'orderBy' | 'limit' | 'offset'>;

interface OrderByValue {
    [name: string]: GraphQLSortOrderValue | OrderByValue[];
}

type WhereValue =
    | { _and: WhereValue[] }
    | { _or: WhereValue[] }
    | {
          [name: string]: WhereValue | WhereFieldValue;
      };

interface WhereFieldValue {
    _eq?: unknown;
    _neq?: unknown;
    _gt?: unknown;
    _lt?: unknown;
    _gte?: unknown;
    _lte?: unknown;
    _in?: unknown;
    _nin?: unknown;
    _like?: unknown;
}

const GRAPHQL_SORTING_ORDER_SOQL_MAPPING: { [name in GraphQLSortOrderValue]: SOQLSortingOrder } = {
    ASC: SOQLSortingOrder.ASC,
    DESC: SOQLSortingOrder.DESC,
    ASC_NULLS_FIRST: SOQLSortingOrder.ASC_NULLS_FIRST,
    ASC_NULLS_LAST: SOQLSortingOrder.ASC_NULLS_LAST,
    DESC_NULLS_FIRST: SOQLSortingOrder.DESC_NULLS_FIRST,
    DESC_NULLS_LAST: SOQLSortingOrder.DESC_NULLS_LAST,
};

const GRAPHQL_COMP_OPERATOR_SOQL_MAPPING: {
    [name in Required<keyof WhereFieldValue>]: SOQLComparisonOperator;
} = {
    _eq: SOQLComparisonOperator.EQ,
    _neq: SOQLComparisonOperator.NEQ,
    _gt: SOQLComparisonOperator.GT,
    _gte: SOQLComparisonOperator.GTE,
    _lt: SOQLComparisonOperator.LT,
    _lte: SOQLComparisonOperator.LTE,
    _in: SOQLComparisonOperator.IN,
    _nin: SOQLComparisonOperator.NIN,
    _like: SOQLComparisonOperator.LIKE,
};

export const resolvers: Resolvers<ResolverContext> = {
    query(entity: Entity, sfdcSchema: SfdcSchema): GraphQLFieldResolver<unknown, ResolverContext> {
        return async (_, args, context, info) => {
            const { api, logger } = context;
            const { parentType } = info;

            const fieldType = parentType.getFields()[info.fieldName];
            const objectType = unwrapObjectType(fieldType.type);

            const selects = resolveSelection({
                info,
                entity,
                objectType,
                sfdcSchema,
                context,
                selectionSet: info.fieldNodes[0].selectionSet!,
            });

            const queryString = queryToString({
                selects,
                table: entity.salesforceName,
                where: {
                    type: SOQLConditionExprType.FIELD_EXPR,
                    field: 'id',
                    operator: SOQLComparisonOperator.EQ,
                    value: args.id,
                },
            });

            logger?.debug('Execute SOQL', queryString);
            const result = await api.executeSOQL(queryString);

            return result.records[0];
        };
    },
    queryMany(
        entity: Entity,
        sfdcSchema: SfdcSchema,
    ): GraphQLFieldResolver<unknown, ResolverContext> {
        return async (_, args, context, info) => {
            const { api, logger } = context;
            const { parentType } = info;

            const fieldType = parentType.getFields()[info.fieldName];
            const fieldAstNode = info.fieldNodes.find(
                (field) => field.name.value === info.fieldName,
            )!;

            const objectType = unwrapObjectType(fieldType.type);
            const selects = resolveSelection({
                info,
                entity,
                objectType,
                sfdcSchema,
                context,
                selectionSet: info.fieldNodes[0].selectionSet!,
            });

            const soqlArgs = resolveQueryManyArgs(info, entity, fieldType, fieldAstNode);

            const query = queryToString({
                selects,
                table: entity.salesforceName,
                ...soqlArgs,
            });

            logger?.debug('Execute SOQL', query);
            const result = await api.executeSOQL(query);

            return result.records;
        };
    },
};

function resolveQueryManyArgs(
    info: GraphQLResolveInfo,
    entity: Entity,
    fieldType: GraphQLField<unknown, ResolverContext>,
    fieldAstNode: FieldNode,
): SOQLQueryOptionals {
    const res: SOQLQueryOptionals = {};

    if (!fieldAstNode.arguments) {
        return res;
    }

    for (const argNode of fieldAstNode.arguments) {
        const argName = argNode.name.value;
        const argType = fieldType.args.find((argType) => argType.name === argName)!;

        const resolvedValue = valueFromAST(argNode.value, argType.type, info.variableValues);

        switch (argName) {
            case 'limit': {
                res.limit = resolvedValue as number;
                break;
            }

            case 'offset': {
                res.offset = resolvedValue as number;
                break;
            }

            case 'where': {
                res.where = resolveWhereExpr(info, entity, resolvedValue as WhereValue);
                break;
            }

            case 'orderBy': {
                res.orderBy = resolveOrderBy(info, entity, resolvedValue as OrderByValue[]);
                break;
            }

            default:
                assert.fail(`Unknown argument name ${argName}`);
        }
    }

    return res;
}

function resolveWhereExpr(
    info: GraphQLResolveInfo,
    entity: Entity,
    whereValue: WhereValue,
    columnPrefix = '',
): SOQLConditionExpr | undefined {
    const combineConditionExprs = (
        exprs: SOQLConditionExpr[],
        operator: SOQLLogicalOperator,
    ): SOQLConditionExpr | undefined => {
        return exprs.reduceRight<SOQLConditionExpr | undefined>((acc, expr) => {
            if (expr === undefined) {
                return acc;
            } else {
                if (acc === undefined) {
                    return expr;
                } else {
                    return {
                        type: SOQLConditionExprType.LOGICAL_EXPR,
                        operator,
                        left: expr,
                        right: acc,
                    };
                }
            }
        }, undefined);
    };

    const resolveLogicalCondition = (
        values: WhereValue[],
        operator: SOQLLogicalOperator,
    ): SOQLConditionExpr | undefined => {
        const exprs = values
            .map((child) => resolveWhereExpr(info, entity, child))
            .filter((expr): expr is SOQLConditionExpr => expr !== undefined);

        return combineConditionExprs(exprs, operator);
    };

    if ('_and' in whereValue) {
        return resolveLogicalCondition(whereValue._and as WhereValue[], SOQLLogicalOperator.AND);
    } else if ('_or' in whereValue) {
        return resolveLogicalCondition(whereValue._or as WhereValue[], SOQLLogicalOperator.OR);
    } else {
        const exprs: SOQLConditionExpr[] = [];

        for (const [fieldName, fieldValue] of Object.entries(whereValue)) {
            const entityField = entity.fields.find((field) => field.normalisedName === fieldName);
            const entityRelationship = entity.childRelationships.find(
                (relation) => relation.normalisedName === fieldName,
            );

            if (entityField) {
                if (isScalarField(entityField)) {
                    const soqlFieldExprs = Object.entries(fieldValue).map(
                        ([operationName, value]): SOQLFieldExpr => {
                            const operator =
                                GRAPHQL_COMP_OPERATOR_SOQL_MAPPING[
                                    operationName as keyof WhereFieldValue
                                ];

                            return {
                                type: SOQLConditionExprType.FIELD_EXPR,
                                field: columnPrefix + entityField.salesforceName,
                                operator,
                                value,
                            };
                        },
                    );
                    exprs.push(...soqlFieldExprs);
                } else {
                    if (isReferenceField(entityField)) {
                        const expr = resolveWhereExpr(
                            info,
                            entityField.referencedEntity!,
                            fieldValue as WhereValue,
                            `${entityField.relationshipName}.`,
                        );

                        if (expr) {
                            exprs.push(expr);
                        }
                    } else {
                        // TODO: Handle polymorphic relationships.
                    }
                }
            } else if (entityRelationship) {
                console.log(entityRelationship);
            } else {
                assert.fail(
                    `Can't find field or relationship named "${fieldName}" on "${entity.normalisedName}"`,
                );
            }
        }

        return combineConditionExprs(exprs, SOQLLogicalOperator.AND);
    }
}

function resolveOrderBy(
    info: GraphQLResolveInfo,
    entity: Entity,
    orderByValues: OrderByValue[],
    columnPrefix = '',
): SOQLOrderByItem[] {
    return orderByValues.flatMap((orderByValue) =>
        Object.entries(orderByValue).flatMap(([fieldName, fieldValue]) => {
            const entityField = entity.fields.find((field) => field.normalisedName === fieldName);
            assert(entityField, `Can't find field ${fieldName} on ${entity.normalisedName}`);

            if (typeof fieldValue === 'string') {
                return {
                    field: columnPrefix + entityField.salesforceName,
                    order: GRAPHQL_SORTING_ORDER_SOQL_MAPPING[fieldValue],
                };
            } else {
                if (isReferenceField(entityField)) {
                    return resolveOrderBy(
                        info,
                        entityField.referencedEntity!,
                        fieldValue,
                        `${entityField.relationshipName}.`,
                    );
                } else {
                    // TODO: Handle polymorphic relationships.
                    return [];
                }
            }
        }),
    );
}

function resolveSelection({
    info,
    entity,
    objectType,
    sfdcSchema,
    selectionSet,
    context,
}: {
    info: GraphQLResolveInfo;
    entity: Entity;
    objectType: GraphQLObjectType;
    sfdcSchema: SfdcSchema;
    selectionSet: SelectionSetNode;
    context: ResolverContext;
}): SOQLSelect[] {
    const soqlSelects: SOQLSelect[] = [];

    for (const selection of selectionSet.selections) {
        switch (selection.kind) {
            case Kind.FIELD: {
                const select = resolveFieldSelection(
                    info,
                    entity,
                    objectType,
                    sfdcSchema,
                    selection,
                    context,
                );

                if (select !== undefined) {
                    soqlSelects.push(select);
                }
                break;
            }

            case Kind.INLINE_FRAGMENT: {
                soqlSelects.push(
                    ...resolveInlineFragmentSelection(
                        info,
                        entity,
                        objectType,
                        sfdcSchema,
                        selection,
                        context,
                    ),
                );
                break;
            }

            case Kind.FRAGMENT_SPREAD: {
                soqlSelects.push(...resolveFragmentSelection(info, sfdcSchema, selection, context));
                break;
            }
        }
    }

    return soqlSelects;
}

function resolveFieldSelection(
    info: GraphQLResolveInfo,
    entity: Entity,
    objectType: GraphQLObjectType<any, any>,
    sfdcSchema: SfdcSchema,
    selection: FieldNode,
    context: ResolverContext,
): SOQLSelect | undefined {
    const fieldName = selection.name.value;

    // Ignore GraphQL [meta fields](https://graphql.org/learn/queries/#meta-fields) in the SOQL
    // generation.
    // TODO: This will certainly have to change when adding support for polymorphic relationships.
    if (fieldName.startsWith('__')) {
        return;
    }

    const fields = objectType.getFields();
    const fieldType = fields[fieldName];

    const entityField = entity.fields.find((entity) => entity.normalisedName === fieldName);
    const entityRelationship = entity.childRelationships.find(
        (relation) => relation.normalisedName === fieldName,
    );
    const additionalField = entity.additionalFields.find((x) => x.name === fieldName);

    if (entityField) {
        if (isScalarField(entityField)) {
            return {
                type: SOQLFieldType.FIELD,
                name: entityField.salesforceName,
            };
        } else if (isReferenceField(entityField) && selection.selectionSet) {
            const referenceEntity = entityField.referencedEntity!;
            const referenceObjectType = unwrapObjectType(fieldType.type);

            const selects = resolveSelection({
                info,
                entity: referenceEntity,
                objectType: referenceObjectType,
                sfdcSchema,
                context,
                selectionSet: selection.selectionSet,
            });

            return {
                type: SOQLFieldType.REFERENCE,
                name: entityField.relationshipName,
                selects,
            };
        } else if (isPolymorphicReference(entityField) && selection.selectionSet) {
            // TODO: Handle polymorphic relationships.
        }
    } else if (entityRelationship) {
        const relationshipEntity = entityRelationship.entity!;
        const relationshipType = unwrapObjectType(fieldType.type);

        const selects = resolveSelection({
            info,
            entity: relationshipEntity,
            objectType: relationshipType,
            sfdcSchema,
            context,
            selectionSet: selection.selectionSet!,
        });

        const queryArgs = resolveQueryManyArgs(info, entity, fieldType, selection);

        return {
            type: SOQLFieldType.SUB_QUERY,
            table: entityRelationship.salesforceName,
            selects,
            ...queryArgs,
        };
    } else if (additionalField) {
        console.log(additionalField);

        return additionalField.select(context);
    } else {
        assert.fail(
            `Can't find field or relationship named "${fieldName}" on "${entity.normalisedName}"`,
        );
    }
}

function resolveInlineFragmentSelection(
    info: GraphQLResolveInfo,
    entity: Entity,
    objectType: GraphQLObjectType<any, any>,
    sfdcSchema: SfdcSchema,
    selection: InlineFragmentNode,
    context: ResolverContext,
): SOQLSelect[] {
    let fragmentEntity = entity;
    let fragmentObjectType = objectType;

    if (selection.typeCondition) {
        const entityName = selection.typeCondition.name.value;

        fragmentEntity = sfdcSchema.entities[fieldNameNormalise(entityName, { pascalCase: true })];
        fragmentObjectType = assertObjectType(info.schema.getType(entityName));
    }

    return resolveSelection({
        info,
        entity: fragmentEntity,
        objectType: fragmentObjectType,
        sfdcSchema,
        context,
        selectionSet: selection.selectionSet,
    });
}

function resolveFragmentSelection(
    info: GraphQLResolveInfo,
    sfdcSchema: SfdcSchema,
    selection: FragmentSpreadNode,
    context: ResolverContext,
): SOQLSelect[] {
    const fragmentName = selection.name.value;
    const fragment = info.fragments[fragmentName];

    const entityName = fragment.typeCondition.name.value;

    const fragmentEntity =
        sfdcSchema.entities[fieldNameNormalise(entityName, { pascalCase: true })];
    const fragmentObjectType = assertObjectType(info.schema.getType(entityName));

    return resolveSelection({
        info,
        entity: fragmentEntity,
        objectType: fragmentObjectType,
        sfdcSchema,
        context,
        selectionSet: fragment.selectionSet,
    });
}

/**
 * Takes a potentially wrapped GraphQL output type (non-nullable and/or list) and return the
 * underlying named type
 */
function unwrapObjectType(_type: GraphQLOutputType): GraphQLObjectType {
    return assertObjectType(getNamedType(_type));
}
