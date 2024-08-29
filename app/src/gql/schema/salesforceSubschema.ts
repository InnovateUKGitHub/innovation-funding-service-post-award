import { ExecutableSchema } from "@gql/getGraphQLSchema";
import { RenameTypes, TransformRootFields, WrapFields } from "@graphql-tools/wrap";
import { configuration } from "@server/features/common/config";
import { buildSchema } from "graphql";
import { DocumentNode } from "graphql/language";
import { GraphQLString } from "graphql/type";
import { createContextFromEmail, GraphQLContext } from "../GraphQLContext";
import sfSchemaText from "./sfSchema.gql";

interface SalesforceQueryArgs {
  login?: string;
}

const salesforceSchema = buildSchema(sfSchemaText);

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

    // assigning to any as type is narrowed at next stage anyway
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await context.api.executeGraphQL<any>({ document, variables, decodeHTMLEntities: true });

    // the errors have a `paths` property from sf, but relay is expecting a `path` property to correctly render errors
    if ("errors" in data && Array.isArray(data.errors)) {
      data.errors = data.errors.map(x => {
        if ("paths" in x && Array.isArray(x.paths)) {
          return { ...x, path: x.paths };
        } else {
          return x;
        }
      });
    }

    return data;
  },
  transforms: [
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
                  // Replace the items within the context with our new context.
                  Object.assign(
                    ctx ?? {},
                    await createContextFromEmail({
                      email: configuration.salesforceServiceUser.serviceUsername,
                      traceId: ctx.traceId,
                    }),
                  );
                  break;
                default:
                  Object.assign(ctx ?? {}, await createContextFromEmail({ email: args.login, traceId: ctx.traceId }));
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

export { salesforceSubschema };
