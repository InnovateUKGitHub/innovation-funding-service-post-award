import { GraphQLContext } from "@gql/GraphQLContext";
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLResolveInfo, SelectionSetNode } from "graphql";
import { Kind, OperationDefinitionNode, FieldNode } from "graphql";
import { GraphQLOutputType } from "graphql/type";

const getBaseType = (inputType: GraphQLOutputType) => {
  let type = inputType;

  let nonNullArray = false;
  let array = false;
  let nonNullType = false;

  if (type instanceof GraphQLNonNull) {
    nonNullType = true;
    type = type.ofType;
  }

  if (type instanceof GraphQLList) {
    nonNullArray = nonNullType;
    array = true;
    nonNullType = false;
    type = type.ofType;
  }

  if (type instanceof GraphQLNonNull) {
    nonNullType = true;
    type = type.ofType;
  }

  return {
    nonNullArray,
    array,
    nonNullType,
    type: type as GraphQLObjectType,
  };
};

interface GraphQLToSalesforceMapperFieldInformation {
  gqlField: string;
  sfField: string;
  kind: "field";
}

interface GraphQLToSalesforceMapperRelationIdsInformation {
  gqlField: string;
  sfField: string;
  kind: "ids";
}
interface GraphQLToSalesforceMapperRelationInformation {
  gqlField: string;
  sfField: string;
  childInfo: GraphQLToSalesforceMapperInformation;
  kind: "relation";
}

interface GraphQLToSalesforceMapperInformation {
  sfTable: string;
  gqlUsedFields: string[];
  sfUsedFields: string[];
  sfFields: (
    | GraphQLToSalesforceMapperFieldInformation
    | GraphQLToSalesforceMapperRelationIdsInformation
    | GraphQLToSalesforceMapperRelationInformation
  )[];
}

const getMap = (
  selectionSet: SelectionSetNode,
  objectType: GraphQLObjectType,
): GraphQLToSalesforceMapperInformation => {
  const sfFields: GraphQLToSalesforceMapperInformation["sfFields"] = [];
  const usedColumns = new Set(selectionSet?.selections.filter(x => x.kind === Kind.FIELD).map(x => x.name?.value));
  usedColumns.add("id");

  for (const [gqlField, x] of Object.entries(objectType.getFields())) {
    if (x.extensions.sfField) {
      sfFields.push({
        gqlField,
        sfField: x.extensions.sfField as string,
        kind: "field",
      });
    } else if (x.extensions.sfRelationIds) {
      sfFields.push({
        gqlField,
        sfField: x.extensions.sfRelationIds as string,
        kind: "ids",
      });
    } else if (x.extensions.sfRelation) {
      sfFields.push({
        gqlField,
        sfField: x.extensions.sfRelation as string,
        childInfo: getMap(
          selectionSet?.selections?.find(x => x.name?.value === gqlField).selectionSet,
          getBaseType(x.type).type,
        ),
        kind: "relation",
      });
    }
  }

  return {
    sfTable: objectType.extensions.sfObject as string,
    gqlUsedFields: [...usedColumns].sort(),
    sfUsedFields: [...usedColumns].map(x => sfFields.find(y => x === y.gqlField)?.sfField).sort(),
    sfFields,
  };
};

const setupDataLoaders = async ({ context, info }: { context: GraphQLContext; info: GraphQLResolveInfo }) => {
  console.log(info);

  const unwrapType = (returnType?: GraphQLOutputType) => {
    if (!returnType) return undefined;

    let unwrappedReturnType = returnType;

    while (unwrappedReturnType instanceof GraphQLList || unwrappedReturnType instanceof GraphQLNonNull) {
      unwrappedReturnType = unwrappedReturnType.ofType;
    }

    return unwrappedReturnType;
  };

  const setupSelectionSet = (selections: OperationDefinitionNode | FieldNode, returnType: GraphQLOutputType) => {
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

                setupSelectionSet(selection, returnField.type);
              }
            }
          }
        }
      }
    }
  };

  setupSelectionSet(info.operation.selectionSet.selections[0] as FieldNode, info.returnType);
};

const sfResolver = async ({
  context,
  info,
  ids,
}: {
  context: GraphQLContext;
  info: GraphQLResolveInfo;
  ids?: string[];
}) => {
  // Obtain the base return type that we require
  const returnType = getBaseType(info.returnType);

  if (returnType) {
    // Salesforce Children
    const gqlToSf = getMap(info.fieldNodes[0].selectionSet, returnType.type);

    const columns = new Set<string>(["Id"]);

    for (const field of gqlToSf.sfFields) {
      if (gqlToSf.gqlUsedFields.includes(field.gqlField)) {
        if (field.kind === "field") columns.add(field.sfField);
        if (field.kind === "ids") columns.add(`(SELECT Id FROM ${field.sfField})`);
      }
    }

    const data = ids
      ? await context.api.selectKeys(gqlToSf.sfTable, [...columns].sort(), ids)
      : await context.api.select(gqlToSf.sfTable, [...columns].sort());

    const returnData = data.map((record: any) => {
      const returnMap: Record<string, any> = {};
      for (const field of gqlToSf.sfFields) {
        if (field.kind === "field") returnMap[field.gqlField] = record[field.sfField];
        if (field.kind === "ids") returnMap[field.gqlField] = record[field.sfField]?.records?.map((x: any) => x.Id);
      }
      return returnMap;
    });

    if (returnType.array) {
      return returnData;
    } else {
      return returnData[0];
    }
  } else {
    throw new Error("Undetermined GQL to SF return type.");
  }
};

export { setupDataLoaders, sfResolver };
