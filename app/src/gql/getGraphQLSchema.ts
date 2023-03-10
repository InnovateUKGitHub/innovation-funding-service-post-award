import { Transform } from "@graphql-tools/delegate";
import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { Logger } from "@shared/developmentLogger";
import { isLocalDevelopment } from "@shared/isEnv";
import { writeFileSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import path from "path";
import { projectIsActiveResolver } from "./resolvers/Acc_Project__c/isActive";
import { rolesResolver } from "./resolvers/Acc_Project__c/roles";
import { getSalesforceSubschema } from "./schema/salesforceSubschema";
import { Api } from "./sf/Api";
import typeDefs from "./typeDefs.gql";
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
const getGraphQLSchema = async ({ api }: { api?: Api }) => {
  const stitchConfig: Parameters<typeof stitchSchemas>[0] = {
    subschemas: [],
  };

  if (api) {
    stitchConfig.subschemas?.push(await getSalesforceSubschema({ api }));
    Object.assign(stitchConfig, {
      typeDefs,
      resolvers: {
        Acc_Project__c: {
          roles: rolesResolver,
          isActive: projectIsActiveResolver,
        },
      },
    });
  }
  stitchConfig.subschemas?.push(await getTypeGraphQLSchema());

  // Stitch the Salesforce API and our "local options" GraphQL schemas together.
  // See `typeDefs.gql` for extensions; extra resolvers used to resolve extensions.
  const schema = stitchSchemas(stitchConfig);

  if (isLocalDevelopment) {
    writeFileSync(fullSchemaFilePath, printSchema(schema), { encoding: "utf-8" });
    logger.warn("Schema", `Written the full schema to "${fullSchemaFilePath}".`);
  }

  return schema;
};

export { getGraphQLSchema };
