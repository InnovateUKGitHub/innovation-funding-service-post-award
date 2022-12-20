import {
    GraphQLFieldConfig,
    GraphQLFieldConfigArgumentMap,
    GraphQLFieldResolver,
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInputType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLSchema,
} from 'graphql';
import {
    ChildRelationship,
    Entity,
    Field,
    isPolymorphicReference,
    isReferenceField,
    isScalarField,
    ReferenceField,
    ScalarField,
    SfdcSchema,
} from '../sfdc/schema';
import { SOQLRecord, SOQLResult } from '../sfdc/types/soql';
import { entityInterfaceType, getScalarInputType, getScalarType, orderByEnumType } from './types';

export interface Resolvers<ExecContext> {
    query?: (entity: Entity, schema: SfdcSchema) => GraphQLFieldResolver<unknown, ExecContext>;
    queryMany?: (entity: Entity, schema: SfdcSchema) => GraphQLFieldResolver<unknown, ExecContext>;
}

interface SchemaConfig<ExecContext> {
    sfdcSchema: SfdcSchema;
    resolvers?: Resolvers<ExecContext>;
}

interface SchemaGenerationContext {
    /** The Salesforce schema used to generate the GraphQL schema. */
    sfdcSchema: SfdcSchema;

    /** Map associating SObject names to GraphQL object types. */
    entityTypes: Map<string, GraphQLObjectType>;

    /** Map associating SObject names to GraphQL where predicate object types. */
    whereTypes: Map<string, GraphQLInputObjectType>;

    /** Map associating SObject names to GraphQL order by object types. */
    orderTypes: Map<string, GraphQLList<GraphQLInputObjectType>>;
}

export function entitiesToSchema<ExecContext>(config: SchemaConfig<ExecContext>): GraphQLSchema {
    const { sfdcSchema, resolvers = {} } = config;

    const ctx: SchemaGenerationContext = {
        sfdcSchema,
        entityTypes: new Map(),
        orderTypes: new Map(),
        whereTypes: new Map(),
    };

    for (const entity of Object.values(sfdcSchema.entities)) {
        const type = createGraphQLEntityType(ctx, entity);
        ctx.entityTypes.set(entity.normalisedName, type);
    }

    const query = createQuery(ctx, resolvers);

    return new GraphQLSchema({
        query,
        types: Array.from(ctx.entityTypes.values()),
    });
}

function createGraphQLEntityType(ctx: SchemaGenerationContext, entity: Entity): GraphQLObjectType {
    const { normalisedName, fields, childRelationships, additionalFields } = entity;

    return new GraphQLObjectType({
        name: normalisedName,
        interfaces: [entityInterfaceType],
        fields: () => {
            const graphQLFields = fields.map((field) => [
                field.normalisedName,
                createGraphQLEntityField(ctx, field),
            ]);
            const graphQLRelationships = childRelationships
                .map((relationship) => [
                    relationship.normalisedName,
                    createGraphQLEntityRelationships(ctx, relationship),
                ])
                .filter(([, value]) => value !== undefined);
            const graphQLExtraFields = additionalFields?.map((field) => [field.name, field.field]) ?? [];

            return Object.fromEntries([
                ...graphQLFields,
                ...graphQLRelationships,
                ...graphQLExtraFields,
            ]);
        },
    });
}

function createGraphQLEntityField(
    ctx: SchemaGenerationContext,
    field: Field,
): GraphQLFieldConfig<SOQLRecord<AnyObject>, unknown> {
    let type: GraphQLOutputType;
    let resolve: GraphQLFieldResolver<SOQLRecord<AnyObject>, unknown> = (source) => {
        return source[field.salesforceName];
    };

    if (isScalarField(field)) {
        type = getScalarType(field);
    } else if (isReferenceField(field)) {
        const { referencedEntity } = field;

        if (!referencedEntity) {
            type = GraphQLID;
        } else {
            type = ctx.entityTypes.get(referencedEntity.normalisedName)!;
            resolve = (source) => {
                return source[field.relationshipName];
            };
        }
    } else {
        // TODO: Add support for polymorphic field lookups.
        type = GraphQLID;
    }

    if (!field.config.nullable) {
        type = new GraphQLNonNull(type);
    }

    return {
        type,
        resolve,
    };
}

function createGraphQLEntityRelationships(
    ctx: SchemaGenerationContext,
    relationship: ChildRelationship,
): GraphQLFieldConfig<SOQLRecord<AnyObject>, unknown> | undefined {
    const { salesforceName, entity } = relationship;

    // Ignore all the children relationships that aren't part of the SFDC graph. While it's possible
    // to produce all the children relationships, it would bloat the schema.
    if (!entity) {
        return;
    }

    const type = ctx.entityTypes.get(entity.normalisedName)!;
    const args = createEntityListArgs(ctx, entity);

    return {
        args,
        type: new GraphQLList(type),
        resolve(source: SOQLRecord<AnyObject>) {
            const subQueryResults = source[salesforceName] as SOQLResult<AnyObject>;
            return subQueryResults?.records ?? [];
        },
    };
}

function createQuery<ExecContext>(
    ctx: SchemaGenerationContext,
    resolvers: Resolvers<ExecContext>,
): GraphQLObjectType {
    const { sfdcSchema } = ctx;
    const entities = Object.values(sfdcSchema.entities);

    return new GraphQLObjectType({
        name: 'Query',
        fields: () => {
            return Object.assign(
                {},
                ...entities.map((entity) => createEntityQueries(ctx, entity, resolvers)),
            );
        },
    });
}

function createEntityQueries<ExecContext>(
    ctx: SchemaGenerationContext,
    entity: Entity,
    resolvers: Resolvers<ExecContext>,
): Record<string, GraphQLFieldConfig<unknown, ExecContext>> {
    const { normalisedName } = entity;
    const { sfdcSchema } = ctx;

    const type = ctx.entityTypes.get(normalisedName)!;

    const queryManyArgs = createEntityListArgs(ctx, entity);
    const querySingleArgs = {
        id: {
            type: GraphQLID,
        },
    };

    return {
        // The value is never null, and the items in the array are never null
        [normalisedName]: {
            args: queryManyArgs,
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(type))),
            resolve: resolvers.queryMany?.(entity, sfdcSchema),
        },

        // Can be either `type` or `null`
        [`${normalisedName}ById`]: {
            args: querySingleArgs,
            type: type,
            resolve: resolvers.query?.(entity, sfdcSchema),
        },
    };
}

function createEntityListArgs(
    ctx: SchemaGenerationContext,
    entity: Entity,
): GraphQLFieldConfigArgumentMap {
    const whereInputType = getWhereInputType(ctx, entity);
    const orderByInputType = getOrderByInputType(ctx, entity);

    return {
        limit: {
            type: GraphQLInt,
        },
        offset: {
            type: GraphQLInt,
        },
        where: {
            type: whereInputType,
        },
        orderBy: {
            type: orderByInputType,
        },
    };
}

function getOrderByInputType(ctx: SchemaGenerationContext, entity: Entity): GraphQLInputType {
    const { normalisedName, fields } = entity;
    let orderByInputType = ctx.orderTypes.get(normalisedName);

    if (orderByInputType === undefined) {
        orderByInputType = new GraphQLList(
            new GraphQLInputObjectType({
                name: `${normalisedName}OrderBy`,
                fields: () =>
                    Object.fromEntries(
                        fields
                            .filter((field) => field.config.sortable)
                            .map((field) => {
                                let type: GraphQLInputType = orderByEnumType;
                                if (isReferenceField(field) && field.referencedEntity) {
                                    type = getOrderByInputType(ctx, field.referencedEntity);
                                }

                                return [
                                    field.normalisedName,
                                    {
                                        type,
                                    },
                                ];
                            }),
                    ),
            }),
        );

        ctx.orderTypes.set(normalisedName, orderByInputType);
    }

    return orderByInputType;
}

function getWhereInputType(ctx: SchemaGenerationContext, entity: Entity): GraphQLInputType {
    const { fields, normalisedName } = entity;
    let whereInputType = ctx.whereTypes.get(normalisedName);

    if (whereInputType === undefined) {
        // The type has to be explicitly set here to please TypeScript, otherwise it bails out
        // because of the recursive reference.
        const _whereInputType: GraphQLInputObjectType = new GraphQLInputObjectType({
            name: `${normalisedName}Where`,
            fields: () => {
                // TODO: Add support for polymorphic fields.
                const filterableFields = fields.filter(
                    (field): field is ScalarField | ReferenceField =>
                        field.config.filterable && !isPolymorphicReference(field),
                );

                const fieldsPredicates = Object.fromEntries(
                    filterableFields.map((field) => {
                        let type: GraphQLInputType;

                        if (isScalarField(field)) {
                            type = getScalarInputType(field.type);
                        } else if (isReferenceField(field)) {
                            if (field.referencedEntity) {
                                type = getWhereInputType(ctx, field.referencedEntity);
                            } else {
                                type = orderByEnumType;
                            }
                        }

                        return [
                            field.normalisedName,
                            {
                                type: type!,
                            },
                        ];
                    }),
                );

                return {
                    _and: {
                        type: new GraphQLList(_whereInputType),
                    },
                    _or: {
                        type: new GraphQLList(_whereInputType),
                    },
                    ...fieldsPredicates,
                };
            },
        });

        whereInputType = _whereInputType;
        ctx.whereTypes.set(normalisedName, _whereInputType);
    }

    return whereInputType;
}
