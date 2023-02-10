import { ForbiddenError } from "@shared/appError";
import { Logger } from "@shared/developmentLogger";
import { Request, Response } from "express";
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

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphQLContext | undefined> => {
  const email = req.session?.user.email ?? null;

  if (email) {
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
    } catch {
      logger.warn("Failed to login", email);
      return undefined;
    }
  }

  throw new ForbiddenError("You are not logged in.");
};
