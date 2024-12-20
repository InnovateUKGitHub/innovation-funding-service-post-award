import { Logger } from "@innovateuk/logger";
import { Request, Response } from "express";
import { getFeedAttachmentDataLoader } from "./dataloader/feedAttachmentDataLoader";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { getUserContactDataLoader } from "./dataloader/userContactDataLoader";
import { getUsernameDataLoader } from "./dataloader/usernameDataLoader";
import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { getProjectClaimStatusCountsDataLoader } from "./dataloader/projectClaimStatusCountsDataLoader";
import { configuration } from "@server/features/common/config";
import { getSalesforceConnection } from "@server/repositories/salesforceConnection";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: TsforceConnection;
  adminApi: TsforceConnection;
  email: string;
  developerEmail: string | null;
  traceId: string;
};

export type GraphQLContext = PartialGraphQLContext & {
  projectRolesDataLoader: ReturnType<typeof getProjectRolesDataLoader>;
  userContactDataLoader: ReturnType<typeof getUserContactDataLoader>;
  usernameDataLoader: ReturnType<typeof getUsernameDataLoader>;
  feedAttachmentDataLoader: ReturnType<typeof getFeedAttachmentDataLoader>;
  projectClaimStatusCountsDataLoader: ReturnType<typeof getProjectClaimStatusCountsDataLoader>;
};

export const createContextFromEmail = async ({
  email,
  developerEmail = null,
  traceId,
}: {
  email: string;
  developerEmail?: string | null;
  traceId: string;
}): Promise<GraphQLContext | EmptyObject> => {
  try {
    const [api, adminApi] = await Promise.all([
      getSalesforceConnection({
        email,
        traceId,
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      }),
      getSalesforceConnection({
        email: configuration.salesforceServiceUser.serviceUsername,
        traceId,
        clientId: configuration.salesforceServiceUser.clientId,
        connectionUrl: configuration.salesforceServiceUser.connectionUrl,
      }),
    ]);

    // Create an incomplete GraphQL context for use in DataLoaders.
    const partialCtx: PartialGraphQLContext = {
      developerEmail,
      email,
      api,
      adminApi,
      traceId,
    };

    // Create a full context, including DataLoaders.
    const ctx: GraphQLContext = {
      ...partialCtx,
      projectRolesDataLoader: getProjectRolesDataLoader(partialCtx),
      userContactDataLoader: getUserContactDataLoader(partialCtx),
      usernameDataLoader: getUsernameDataLoader(partialCtx),
      feedAttachmentDataLoader: getFeedAttachmentDataLoader(partialCtx),
      projectClaimStatusCountsDataLoader: getProjectClaimStatusCountsDataLoader(partialCtx),
    };

    return ctx;
  } catch (e) {
    logger.warn("Failed to login", { email, traceId });
    return {};
  }
};

export const createContext = ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext | EmptyObject> => {
  const email = req.session?.user.email ?? null;
  const developerEmail = req.session?.user?.developer_oidc_username ?? null;
  const traceId = res.locals.traceId;

  if (email) return createContextFromEmail({ email, developerEmail, traceId });
  return Promise.resolve({});
};
