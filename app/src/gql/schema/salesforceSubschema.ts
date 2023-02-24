import { ExecutableSchema } from "@gql/getGraphQLSchema";
import { Api } from "@gql/sf/Api";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchema } from "@graphql-tools/load";
import { FilterTypes, introspectSchema, RenameTypes, TransformRootFields, WrapFields } from "@graphql-tools/wrap";
import { configuration } from "@server/features/common";
import { Logger } from "@shared/developmentLogger";
import { isLocalDevelopment } from "@shared/isEnv";
import { existsSync, writeFileSync } from "fs";
import { GraphQLSchema, printSchema } from "graphql";
import { DocumentNode } from "graphql/language";
import { GraphQLString } from "graphql/type";
import path from "path";
import { createContextFromEmail, GraphQLContext } from "../GraphQLContext";

const typesToRemove = [
  "AttachedContentNoteConnection",
  "AttachedContentNote",
  "Exception_Log__e",
  "MO_Account_Share__e",
  "MO_Live_Projects_Count__e",
  "MO_New_Register__e",
  "MO_Post_Community_Group__e",
  "nbavs__CTIDeviceUpdateEvent__e",
  "nbavs__LogoutEvent__e",
];

interface SalesforceQueryArgs {
  login?: string;
}

const sfSchemaFilePath = path.join("src", "gql", "schema", "sfSchema.gql");

const logger = new Logger("GraphQL SF Subschema");

const getSalesforceSubschema = async ({ api }: { api: Api }) => {
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
    transforms: [
      /**
       * Remove types that will break our GraphQL server
       */
      new FilterTypes(t => !typesToRemove.includes(t.name)),

      /**
       * Rename the original Salesforce GQL API Query to SalesforceQuery
       */
      new RenameTypes(t => {
        switch (t) {
          case "Query":
            return "SalesforceQuery";
          default:
            return t;
        }
      }),

      /**
       * Create a new field "salesforce" on the real "Query" that points to the Salesforce API "SalesforceQuery"
       */
      new WrapFields("Query", ["salesforce"], ["SalesforceQuery"]),

      /**
       * Manipulate the Query#salesforce field to inject additional "login" argument,
       * which switches the user context when used.
       */
      new TransformRootFields((operationName, fieldName, fieldConfig) => {
        if (operationName === "Query" && fieldName === "salesforce") {
          return {
            ...fieldConfig,
            resolve: async (source, args: SalesforceQueryArgs, ctx, info) => {
              // Change the user ctx if login arg passed.
              if (!configuration.sso.enabled && args.login) {
                switch (args.login) {
                  case "system":
                    Object.assign(
                      ctx ?? {},
                      await createContextFromEmail({ email: configuration.salesforceServiceUser.serviceUsername }),
                    );
                    break;
                  default:
                    Object.assign(ctx ?? {}, await createContextFromEmail({ email: args.login }));
                    break;
                }
              }

              return fieldConfig?.resolve?.(source, args, ctx, info);
            },

            // Add login arg to Query#salesforce
            args: {
              login: {
                description: "The user to login as",
                type: GraphQLString,
              },
            },
          };
        }

        return fieldConfig;
      }),
    ],
  };

  return salesforceSubschema;
};

export { getSalesforceSubschema };
