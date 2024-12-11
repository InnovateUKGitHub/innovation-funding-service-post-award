import { ForbiddenError } from "@shared/appError";
import { Logger } from "@innovateuk/logger";
import { Request, Response } from "express";
import { getFeedAttachmentDataLoader } from "../server/dataloader/loader/feedAttachmentDataLoader";
import { getProjectRolesDataLoader } from "../server/dataloader/loader/projectRolesDataLoader";
import { getUserContactDataLoader } from "../server/dataloader/loader/userContactDataLoader";
import { getUsernameDataLoader } from "../server/dataloader/loader/usernameDataLoader";
import { TsforceConnection } from "@innovateuk/tsforce/TsforceConnection";
import { getProjectClaimStatusCountsDataLoader } from "../server/dataloader/loader/projectClaimStatusCountsDataLoader";
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

    // Create a full context, including DataLoaders.
    const ctx: GraphQLContext = {
      developerEmail,
      email,
      api,
      adminApi,
      traceId,
      projectRolesDataLoader: getProjectRolesDataLoader({ email, api }),
      userContactDataLoader: getUserContactDataLoader({ email, api }),
      usernameDataLoader: getUsernameDataLoader({ email, api }),
      feedAttachmentDataLoader: getFeedAttachmentDataLoader({ email, api: adminApi }),
      projectClaimStatusCountsDataLoader: getProjectClaimStatusCountsDataLoader({ email, api }),
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

  throw new ForbiddenError("You are not logged in.");
};
