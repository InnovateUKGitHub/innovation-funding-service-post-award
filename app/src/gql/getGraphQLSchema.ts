import { Transform } from "@graphql-tools/delegate";
import { stitchSchemas } from "@graphql-tools/stitch";
import type { ExecutionRequest } from "@graphql-tools/utils/typings";
import { Logger } from "@shared/developmentLogger";
import { writeFileSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import path from "path";
import { projectIsActiveResolver } from "./resolvers/Acc_Project__c/isActive";
import { rolesResolver } from "./resolvers/Acc_Project__c/roles";
import { salesforceSubschema } from "./schema/salesforceSubschema";
import { TsforceConnection } from "../server/tsforce/TsforceConnection";
import typeDefs from "./typeDefs.gql";
import { getTypeGraphQLSchema } from "./typegraphql/schema";
import { usernameResolver } from "./resolvers/Acc_ProjectContactLink__c/username";
import { isFeedAttachmentResolver } from "./resolvers/ContentDocument/isFeedAttachment";
import { isOwnerResolver } from "./resolvers/ContentDocument/isOwner";
import { configuration } from "@server/features/common/config";
import { claimCountsResolver } from "./resolvers/Acc_Project__c/claimCounts";

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
const getGraphQLSchema = async ({ api }: { api?: TsforceConnection }) => {
  const stitchConfig: Parameters<typeof stitchSchemas>[0] = {
    subschemas: [],
  };

  if (api) {
    stitchConfig.subschemas?.push(salesforceSubschema);
    Object.assign(stitchConfig, {
      typeDefs,
      resolvers: {
        Acc_Project__c: {
          roles: rolesResolver,
          isActive: projectIsActiveResolver,
          claimCounts: claimCountsResolver,
        },
        Contact: {
          username: usernameResolver,
        },
        ContentDocumentLink: {
          isFeedAttachment: isFeedAttachmentResolver,
          isOwner: isOwnerResolver,
        },
      },
    });
  }
  stitchConfig.subschemas?.push(await getTypeGraphQLSchema());

  // Stitch the Salesforce API and our "local options" GraphQL schemas together.
  // See `typeDefs.gql` for extensions; extra resolvers used to resolve extensions.
  const schema = stitchSchemas(stitchConfig);

  if (configuration.developer.writeGraphQL) {
    writeFileSync(fullSchemaFilePath, printSchema(schema), { encoding: "utf-8" });
    logger.warn("Schema", `Written the full schema to "${fullSchemaFilePath}".`);
  }

  return schema;
};

export { getGraphQLSchema };
