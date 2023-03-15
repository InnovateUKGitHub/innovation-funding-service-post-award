import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request } from "express";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { getUserContactDataLoader } from "./dataloader/userContactDataLoader";
import { Api } from "./sf/Api";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: Api;
  email: string;
};

export type GraphQLContext = PartialGraphQLContext & {
  projectRolesDataLoader: ReturnType<typeof getProjectRolesDataLoader>;
  userContactDataLoader: ReturnType<typeof getUserContactDataLoader>;
};

export const createContextFromEmail = async ({ email }: { email: string }): Promise<GraphQLContext | EmptyObject> => {
  try {
    const api = await Api.asUser(email);

    // Create an incomplete GraphQL context for use in DataLoaders.
    const partialCtx: PartialGraphQLContext = {
      email,
      api,
    };

    // Create a full context, including DataLoaders.
    const ctx: GraphQLContext = {
      ...partialCtx,
      projectRolesDataLoader: getProjectRolesDataLoader(partialCtx),
      userContactDataLoader: getUserContactDataLoader(partialCtx),
    };

    return ctx;
  } catch (e) {
    logger.warn("Failed to login", email, e);
    return {};
  }
};

export const createContext = ({ req }: { req: Request }): Promise<GraphQLContext | EmptyObject> => {
  const email = req.session?.user.email ?? null;

  if (email) return createContextFromEmail({ email });

  throw new ForbiddenError("You are not logged in.");
};
