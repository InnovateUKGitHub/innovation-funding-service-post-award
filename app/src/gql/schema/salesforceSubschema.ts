import { ExecutableSchema } from "@gql/getGraphQLSchema";
import { RenameTypes, TransformRootFields, WrapFields } from "@graphql-tools/wrap";
import { configuration } from "@server/features/common/config";
import { buildSchema } from "graphql";
import { DocumentNode } from "graphql/language";
import { GraphQLString } from "graphql/type";
import { createContextFromEmail, GraphQLContext } from "../GraphQLContext";
import sfSchemaText from "./sfSchema.gql";
import { Authorisation } from "@framework/types/authorisation";

import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { hasAccess } from "@gql/access/AccessControl";
import { contextProvider } from "@server/features/common/contextProvider";
import { ForbiddenError } from "@shared/appError";
import { getMutationHash } from "@gql/utils/mutationTextSimplifier";

interface SalesforceQueryArgs {
  login?: string;
}

interface MutationParamsArgs {
  projectId?: ProjectId;
  partnerId?: PartnerId;
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await context.api.executeGraphQL<any>({ document, variables, decodeHTMLEntities: true });

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

    new TransformRootFields((operationName, fieldName, fieldConfig) => {
      if (operationName === "Mutation" && fieldName === "uiapi") {
        return {
          ...fieldConfig,
          resolve: async (source, args: MutationParamsArgs, ctx, info) => {
            // extract projectId and partnerId for access control with mutations
            let projectId: ProjectId = "unknownProjectId" as ProjectId;
            let partnerId: PartnerId = "unknownPartnerId" as PartnerId;
            if (args.projectId) {
              projectId = args.projectId;
            }
            if (args.partnerId) {
              partnerId = args.partnerId;
            }

            const mutationBody = info.operation.loc?.source?.body ?? "unknown";

            const hash = getMutationHash(mutationBody, true);

            const serverContext = await contextProvider.start({
              user: {
                email: ctx.email,
                projectId: projectId ?? "",
              },
              traceId: ctx.traceId,
            });
            if (!serverContext) {
              throw new Error("Unable to access the server context");
            }

            /**
             * can this be cached?
             * cache should have session scope only
             */
            const projectRoles = await serverContext.runQuery(new GetAllProjectRolesForUser());

            const auth = new Authorisation(projectRoles.permissions);

            const isAuthorised = hasAccess(hash, auth, {
              projectId,
              partnerId,
            });

            if (!isAuthorised) {
              throw new ForbiddenError("You are forbibben loser");
            }

            return fieldConfig?.resolve?.(source, args, ctx, info);
          },
          args: {
            projectId: {
              description: "The current project id",
              type: GraphQLString,
            },
            partnerId: {
              description: "The current partner id",
              type: GraphQLString,
            },
          },
        };
      }
    }),
  ],
};

export { salesforceSubschema };
