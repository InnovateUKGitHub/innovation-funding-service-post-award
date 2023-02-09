import { Transform } from "@graphql-tools/delegate";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { Logger } from "@shared/developmentLogger";
import { isLocalDevelopment } from "@shared/isEnv";
import { writeFileSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import path from "path";
import { Api } from "./sf/Api";
import { getTypeGraphQLSchema } from "./typegraphql/schema";

export interface ExecutableSchema {
  schema: GraphQLSchema;
  executor: <T>({ document, variables }: ExecutionRequest) => Promise<{ data: T }>;
  transforms?: Transform[];
}

const logger = new Logger("GraphQL");

const fullSchemaFilePath = path.join("src", "gql", "schema", "fullSchema.gql");

/**
 * Fetch the GraphQL server used by clients of IFSPA.
 *
 * This is a merge of two GraphQL schemas
 *  - Official Salesforce GraphQL API
 *  - Local GraphQL "client options"
 *
 * @returns A server-executable GraphQL schema
 */
const getGraphQLSchema = async ({ api }: { api: Api }) => {
  // const salesforceSubschema = await getSalesforceSubschema({ api });
  const schema = await getTypeGraphQLSchema();

  if (isLocalDevelopment) {
    writeFileSync(fullSchemaFilePath, printSchema(schema), { encoding: "utf-8" });
    logger.warn("Schema", `Written the full schema to "${fullSchemaFilePath}".`);
  }

  return schema;
};

export { getGraphQLSchema };
