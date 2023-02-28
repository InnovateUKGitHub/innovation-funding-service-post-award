import { IContext } from "@framework/types";
import { ISession } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request, Response } from "express";
import { getProjectRolesDataLoader } from "./dataloader/projectRolesDataLoader";
import { Api } from "./sf/Api";

const logger = new Logger("GraphQLContext");

export type PartialGraphQLContext = Record<string, unknown> & {
  api: Api;
  email: string;
  legacyContext: IContext;
};

export type GraphQLContext = PartialGraphQLContext & {
  projectRolesDataLoader: ReturnType<typeof getProjectRolesDataLoader>;
};

export const createContext = async ({ req }: { req: Request }): Promise<GraphQLContext | undefined> => {
  const email = req.session?.user.email ?? null;

  const session: ISession = { user: req.session?.user };
  const legacyContext = contextProvider.start(session);

  if (email) {
    try {
      const api = await Api.asUser(email);

      // Create an incomplete GraphQL context for use in Dataloaders.
      const partialCtx: PartialGraphQLContext = {
        email,
        api,
        legacyContext,
      };

      // Create a full context, including dataloaders.
      const ctx: GraphQLContext = {
        ...partialCtx,
        projectRolesDataLoader: getProjectRolesDataLoader(partialCtx),
      };

      return ctx;
    } catch {
      logger.warn("Failed to login", email);
      return undefined;
    }
  }

  throw new ForbiddenError("You are not logged in.");
};
