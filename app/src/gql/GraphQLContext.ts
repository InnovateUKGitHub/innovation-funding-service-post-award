import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request } from "express";
import { getFeedAttachmentDataLoader } from "./dataloader/feedAttachmentDataLoader";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { getUserContactDataLoader } from "./dataloader/userContactDataLoader";
import { getUsernameDataLoader } from "./dataloader/usernameDataLoader";
import { Api } from "./sf/Api";
import { getProjectClaimStatusCountsDataLoader } from "./dataloader/projectClaimStatusCountsDataLoader";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: Api;
  adminApi: Api;
  email: string;
  developerEmail: string | null;
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
}: {
  email: string;
  developerEmail?: string | null;
}): Promise<GraphQLContext | EmptyObject> => {
  try {
    const [api, adminApi] = await Promise.all([Api.asUser(email), Api.asSystemUser()]);

    // Create an incomplete GraphQL context for use in DataLoaders.
    const partialCtx: PartialGraphQLContext = {
      developerEmail,
      email,
      api,
      adminApi,
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
    logger.warn("Failed to login", email, e);
    return {};
  }
};

export const createContext = ({ req }: { req: Request }): Promise<GraphQLContext | EmptyObject> => {
  const email = req.session?.user.email ?? null;
  const developerEmail = req.session?.user?.developer_oidc_username ?? null;

  if (email) return createContextFromEmail({ email, developerEmail });

  throw new ForbiddenError("You are not logged in.");
};
