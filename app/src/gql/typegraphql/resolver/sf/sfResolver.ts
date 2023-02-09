import { GraphQLContext } from "@gql/GraphQLContext";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, SelectionSetNode } from "graphql";
import { Kind, OperationDefinitionNode, FieldNode } from "graphql";
import { GraphQLOutputType } from "graphql/type";

const unwrapType = (returnType?: GraphQLOutputType) => {
  if (!returnType) return undefined;

  let unwrappedReturnType = returnType;

  while (unwrappedReturnType instanceof GraphQLList || unwrappedReturnType instanceof GraphQLNonNull) {
    unwrappedReturnType = unwrappedReturnType.ofType;
  }

  return unwrappedReturnType;
};

const setupSelectionSet = ({
  context,
  selections,
  returnType,
  recursive = false,
}: {
  context: GraphQLContext;
  selections: OperationDefinitionNode | FieldNode;
  returnType: GraphQLOutputType;
  recursive?: boolean;
}) => {
  const unwrappedReturnType = unwrapType(returnType);

  if (unwrappedReturnType instanceof GraphQLObjectType) {
    const returnableFields = unwrappedReturnType.getFields();

    if (selections.selectionSet) {
      for (const selection of selections.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
          const selectionName = selection.name.value;
          const returnField = returnableFields[selectionName];
          const returnFieldType = unwrapType(returnField.type);

          if (returnFieldType instanceof GraphQLObjectType) {
            const usableFields = returnFieldType.getFields();
            const sfObject = returnFieldType?.extensions.sfObject as string;

            if (returnField && sfObject) {
              const sfFields: string[] =
                selection?.selectionSet?.selections
                  .map(x => {
                    if (x.kind === Kind.FIELD) {
                      const { extensions } = usableFields[x.name.value];
                      if (extensions.sfField) return extensions.sfField as string;
                      if (extensions.sfRelationIds) return `(SELECT Id FROM ${extensions.sfRelationIds})` as string;
                    }
                    return "";
                  })
                  .filter(x => !!x)
                  .sort() ?? [];

              if (sfFields.length) {
                context.api.createDataLoader(sfObject, sfFields);
              }

              setupSelectionSet({ context, selections: selection, returnType: returnField.type, recursive });
            }
          }
        }
      }
    }
  }
};

const setupDataLoaders = async ({ context, info }: { context: GraphQLContext; info: GraphQLResolveInfo }) => {
  setupSelectionSet({
    context,
    selections: info.operation.selectionSet.selections[0] as FieldNode,
    returnType: info.returnType,
  });
};

const sfResolver = async ({
  context,
  info,
  ids,
  singular = false,
}: {
  context: GraphQLContext;
  info: GraphQLResolveInfo;
  ids?: string[];
  singular?: boolean;
}) => {
  const selection = info.fieldNodes[0] as FieldNode;
  const returnType = info.returnType;

  const unwrappedReturnType = unwrapType(returnType);

  if (unwrappedReturnType instanceof GraphQLObjectType) {
    const usableFields = unwrappedReturnType.getFields();
    const sfObject = unwrappedReturnType?.extensions.sfObject as string;

    if (sfObject && selection?.selectionSet?.selections) {
      const sfFields: string[] =
        selection.selectionSet.selections
          .map(x => {
            if (x.kind === Kind.FIELD) {
              const { extensions } = usableFields[x.name.value];
              if (extensions.sfField) return extensions.sfField as string;
              if (extensions.sfRelationIds) return `(SELECT Id FROM ${extensions.sfRelationIds})` as string;
            }
            return "";
          })
          .filter(x => !!x)
          .sort() ?? [];

      let data = ids
        ? await context.api.selectKeys(sfObject, sfFields, ids)
        : await context.api.select(sfObject, sfFields);

      const mappedData: AnyObject[] = [];
      for (const result of data) {
        const outputMap: AnyObject = {};

        for (const field of selection.selectionSet.selections) {
          if (field.kind === Kind.FIELD) {
            const { extensions } = usableFields[field.name.value];

            if (typeof extensions.sfField === "string") {
              outputMap[field.name.value] = result[extensions.sfField];
            } else if (typeof extensions.sfRelationIds === "string") {
              outputMap[field.name.value] = result[extensions.sfRelationIds].records.map(x => x.Id);
            } else if (typeof extensions.sfRelation === "string") {
              outputMap[field.name.value] = result[extensions.sfRelation].records.map(x => x.Id);
            }
          }
        }

        mappedData.push(outputMap);
      }

      if (singular) {
        return mappedData[0];
      } else {
        return mappedData;
      }
    }
  }
};

export { setupDataLoaders, sfResolver };
