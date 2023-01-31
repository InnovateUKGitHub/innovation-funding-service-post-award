import type { ASTNode, GraphQLSchema } from "graphql";
import { Kind, parse, printSchema, print } from "graphql";

/**
 * Function to pass into Array.sort() to sort an array of ASTNodes.
 *
 * @example
 * ast.definitions.sort(sortFunction);
 */
const sortFunction = (a: DeepWriteable<ASTNode>, b: DeepWriteable<ASTNode>): number => {
  // If the "name" key exists in both A and B, attempt to sort with that.
  if ("name" in a && "name" in b) {
    if (a.name && b.name) {
      return a.name.value.localeCompare(b.name.value);
    } else if (a.name) {
      return 1;
    } else if (b.name) {
      return -1;
    } else {
      return 0;
    }
  } else if ("name" in a) {
    return 1;
  } else if ("name" in b) {
    return -1;
  } else {
    return 0;
  }
};

/**
 * Walk along a GraphQL AST and sort arrays in alphabetical order.
 *
 * @param node Input AST to sort
 * @returns The same node, but with sorted arrays.
 */
const walk = (node: DeepWriteable<ASTNode>) => {
  let arrayItem: DeepWriteable<ASTNode>[] | undefined;

  if (node.kind === Kind.DOCUMENT) arrayItem = node.definitions;
  if (node.kind === Kind.OBJECT_TYPE_DEFINITION && node.fields) arrayItem = node.fields;
  if (node.kind === Kind.ENUM_TYPE_DEFINITION && node.values) arrayItem = node.values;
  if (node.kind === Kind.FIELD_DEFINITION && node.arguments) arrayItem = node.arguments;
  if (node.kind === Kind.INPUT_OBJECT_TYPE_DEFINITION && node.fields) arrayItem = node.fields;

  if (arrayItem) arrayItem.sort(sortFunction).forEach(walk);

  return node as ASTNode;
};

/**
 * Convert a GraphQL Schema to a GraphQL SDL, with
 * fields, types, enum values and more arranged in a
 * determininstic order.
 *
 * @param schema The schema to convert into a GraphQL SDL
 * @returns A string representation of the GraphQL SDL
 */
const schemaToString = (schema: GraphQLSchema): string =>
  // print resultant sorted SDL
  print(
    // walk along the schema to find all sortable items
    walk(
      // print-parse the schema to create a duplicate AST
      parse(printSchema(schema)) as DeepWriteable<ASTNode>,
    ),
  );

export { schemaToString };
