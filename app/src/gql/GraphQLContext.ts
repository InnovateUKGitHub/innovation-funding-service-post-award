import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request, Response } from "express";
import { getFeedAttachmentDataLoader } from "./dataloader/feedAttachmentDataLoader";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { getUserContactDataLoader } from "./dataloader/userContactDataLoader";
import { getUsernameDataLoader } from "./dataloader/usernameDataLoader";
import { TsforceConnection } from "../server/tsforce/TsforceConnection";
import { getProjectClaimStatusCountsDataLoader } from "./dataloader/projectClaimStatusCountsDataLoader";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: TsforceConnection;
  adminApi: TsforceConnection;
  email: string;
  developerEmail: string | null;
  tid: string;
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
  tid,
}: {
  email: string;
  developerEmail?: string | null;
  tid: string;
}): Promise<GraphQLContext | EmptyObject> => {
  try {
    const [api, adminApi] = await Promise.all([
      TsforceConnection.asUser(email, tid),
      TsforceConnection.asSystemUser(tid),
    ]);

    // Create an incomplete GraphQL context for use in DataLoaders.
    const partialCtx: PartialGraphQLContext = {
      developerEmail,
      email,
      api,
      adminApi,
      tid,
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
    logger.warn("Failed to login", { email, tid });
    return {};
  }
};

export const createContext = ({ req, res }: { req: Request; res: Response }): Promise<GraphQLContext | EmptyObject> => {
  const email = req.session?.user.email ?? null;
  const developerEmail = req.session?.user?.developer_oidc_username ?? null;
  const tid = res.locals.tid;

  if (email) return createContextFromEmail({ email, developerEmail, tid });

  throw new ForbiddenError("You are not logged in.");
};
