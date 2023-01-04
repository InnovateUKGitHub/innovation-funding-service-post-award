import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { introspectSchema } from "@graphql-tools/wrap";
import { Logger } from "@shared/developmentLogger";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { GraphQLSchema, print, printSchema } from "graphql";
import { rolesResolver } from "./resolvers/Acc_Project__c/roles";
import { Api } from "./sf/Api";
import typeDefs from "./typeDefs.gql";
import { getTypeGraphQLSchema } from "./typegraphql/schema";

export interface ExecutableSchema {
  schema: GraphQLSchema;
  executor: <T>({ document, variables }: ExecutionRequest) => Promise<{ data: T }>;
}

const logger = new Logger("GQL Schema");

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
      if (existsSync("schema.json")) {
        logger.warn("Introspection", "Using existing Salesforce `schema.json` file. Delete and reload to refresh.");
        return JSON.parse(readFileSync("schema.json", { encoding: "utf-8" }));
      } else {
        // Otherwise, warn that the download process of the schema will take a while.
        logger.warn(
          "Introspection",
          "About to introspect the Salesforce GraphQL schema - This **will** take a while...",
        );

        // Download the schema from Salesforce
        const data = await api.executeGraphQL(request);

        // Write to disk for later use
        writeFileSync("schema.json", JSON.stringify(data, null, 2) + "\n", { encoding: "utf-8" });
        logger.warn("Introspection", "Completed! Written the schema to `schema.json` for the future.");
        return data;
      }
    }),
    executor: async ({ document, variables }) => {
      const data = await api.executeGraphQL({ document, variables });
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

  // Write the GraphQL schema to file.
  try {
    logger.debug("About to write GraphQL schema to disk.");
    writeFileSync("schema.gql", printSchema(schema), { encoding: "utf-8" });
  } catch {
    logger.warn(
      "Failed to write GraphQL schema to disk.",
      "This is required for local development for use with Relay.",
    );
  }

  return schema;
};

export { getGraphQLSchema };
