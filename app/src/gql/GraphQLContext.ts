import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request } from "express";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { Api } from "./sf/Api";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: Api;
  email: string;
};

export type GraphQLContext = PartialGraphQLContext & {
  projectRolesDataLoader: ReturnType<typeof getProjectRolesDataLoader>;
};

export const createContextFromEmail = async ({ email }: { email: string }): Promise<GraphQLContext | undefined> => {
  try {
    const api = await Api.asUser(email);

    // Create an incomplete GraphQL context for use in Dataloaders.
    const partialCtx: PartialGraphQLContext = {
      email,
      api,
    };

    // Create a full context, including dataloaders.
    const ctx: GraphQLContext = {
      ...partialCtx,
      projectRolesDataLoader: getProjectRolesDataLoader(partialCtx),
    };

    return ctx;
  } catch (e) {
    logger.warn("Failed to login", email, e);
    return undefined;
  }
};

export const createContext = ({ req }: { req: Request }): Promise<GraphQLContext | undefined> => {
  const email = req.session?.user.email ?? null;

  if (email) return createContextFromEmail({ email });

  throw new ForbiddenError("You are not logged in.");
};
