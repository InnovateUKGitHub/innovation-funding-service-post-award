import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { introspectSchema } from "@graphql-tools/wrap";
import { Logger } from "@shared/developmentLogger";
import { writeFileSync } from "fs";
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

const getGraphQLSchema = async ({ api }: { api: Api }) => {
  const salesforceSubschema: ExecutableSchema = {
    schema: await introspectSchema(request => {
      logger.warn("About to introspect the Salesforce GraphQL schema - This will take a while...");
      return api.executeGraphQL(request);
    }),
    executor: async ({ document, variables }) => {
      const data = await api.executeGraphQL({ document, variables });
      logger.trace("Queried", print(document), data, variables);
      return data;
    },
  };
  const localSchema = await getTypeGraphQLSchema();

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
