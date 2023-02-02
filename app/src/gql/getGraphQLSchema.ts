import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { introspectSchema } from "@graphql-tools/wrap";
import { Logger } from "@shared/developmentLogger";
import { isLocalDevelopment } from "@shared/isEnv";
import { existsSync, writeFileSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import { DocumentNode } from "graphql/language";
import path from "path";
import { GraphQLContext } from "./GraphQLContext";
import { projectIsActiveResolver } from "./resolvers/Acc_Project__c/isActive";
import { rolesResolver } from "./resolvers/Acc_Project__c/roles";
import { Api } from "./sf/Api";
import typeDefs from "./typeDefs.gql";
import { getTypeGraphQLSchema } from "./typegraphql/schema";

export interface ExecutableSchema {
  schema: GraphQLSchema;
  executor: <T>({ document, variables }: ExecutionRequest) => Promise<{ data: T }>;
}

const logger = new Logger("GraphQL");

const sfSchemaFilePath = path.join("src", "gql", "schema", "sfSchema.gql");
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
  let salesforceSchema: GraphQLSchema;

  if (existsSync(sfSchemaFilePath)) {
    logger.warn(
      "Salesforce Subschema",
      `Using existing Salesforce "${sfSchemaFilePath}" file. Delete and reload to refresh.`,
    );

    salesforceSchema = await loadSchema(sfSchemaFilePath, { loaders: [new GraphQLFileLoader()] });
  } else {
    logger.warn(
      "Salesforce Subschema",
      "About to introspect the Salesforce GraphQL schema - This **will** take a while...",
    );

    salesforceSchema = await introspectSchema(async request => {
      const data = await api.executeGraphQL<AnyObject>(request);
      return data;
    });

    logger.warn("Salesforce Subschema", "Completed!");

    if (isLocalDevelopment) {
      writeFileSync(sfSchemaFilePath, printSchema(salesforceSchema), { encoding: "utf-8" });
      logger.warn("Salesforce Subschema", `Written the schema to "${sfSchemaFilePath}" for the future.`);
    }
  }

  const salesforceSubschema: ExecutableSchema = {
    schema: salesforceSchema,
    executor: async ({
      document,
      variables,
      context,
    }: {
      document: DocumentNode;
      context?: GraphQLContext;
      variables?: AnyObject;
    }) => {
      if (!context) throw new Error("No context was provided to the GraphQL executor");
      return await context.api.executeGraphQL({ document, variables, decodeHTMLEntities: true });
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
        roles: rolesResolver,
        isActive: projectIsActiveResolver,
      },
    },
  });

  if (isLocalDevelopment) {
    writeFileSync(fullSchemaFilePath, printSchema(schema), { encoding: "utf-8" });
    logger.warn("Schema", `Written the full schema to "${fullSchemaFilePath}".`);
  }

  return schema;
};

export { getGraphQLSchema };
