import path from "path";
import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { introspectSchema } from "@graphql-tools/wrap";
import { Logger } from "@shared/developmentLogger";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { GraphQLSchema, print } from "graphql";
import { rolesResolver } from "./resolvers/Acc_Project__c/roles";
import { Api } from "./sf/Api";
import typeDefs from "./typeDefs.gql";
import { getTypeGraphQLSchema } from "./typegraphql/schema";

export interface ExecutableSchema {
  schema: GraphQLSchema;
  executor: <T>({ document, variables }: ExecutionRequest) => Promise<{ data: T }>;
}

const logger = new Logger("GQL Schema");

const sfSchemaPath = path.join(process.env.GQL_SCHEMA_DIR ?? "", "schema.json");

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
  const salesforceSubschema: ExecutableSchema = {
    schema: await introspectSchema(async request => {
      // If the schema has already been fetched in a previous run, use that!
      if (existsSync(sfSchemaPath)) {
        logger.warn("Introspection", `Using existing Salesforce "${sfSchemaPath}" file. Delete and reload to refresh.`);
        return JSON.parse(readFileSync(sfSchemaPath, { encoding: "utf-8" }));
      } else {
        // Otherwise, warn that the download process of the schema will take a while.
        logger.warn(
          "Introspection",
          "About to introspect the Salesforce GraphQL schema - This **will** take a while...",
        );

        // Download the schema from Salesforce
        const data = await api.executeGraphQL(request);

        // Write to disk for later use
        writeFileSync(sfSchemaPath, JSON.stringify(data), {
          encoding: "utf-8",
        });
        logger.warn(`Introspection", "Completed! Written the schema to "${sfSchemaPath}" for the future.`);
        return data;
      }
    }),
    executor: async ({ document, variables, context }) => {
      const data = await context.api.executeGraphQL({ document, variables });
      logger.trace("Queried", print(document), data, variables);
      return data;
    },
  };
  const localSchema = await getTypeGraphQLSchema();

  // Stitch the Salesforce API and our "local options" GraphQL schemas together.
  // See `typeDefs.gql` for extensions; extra resolvers used to resolve extensions.
  const schema = stitchSchemas({
    subschemas: [salesforceSubschema, localSchema],
    typeDefs,
    resolvers: {
      Acc_Project__c: {
        roles: rolesResolver(salesforceSubschema),
      },
    },
  });

  return schema;
};

export { getGraphQLSchema };
