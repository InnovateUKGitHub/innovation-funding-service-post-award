import { Logger } from "@shared/developmentLogger";
import { Response } from "express";
import { Api } from "./sf/Api";

export type GraphQLContext = Record<string, unknown> & {
  api: Api;
  email: string | null;
  logger: Logger;
};

export const createContext = ({ res, logger }: { res: Response; logger: Logger }): GraphQLContext => {
  return {
    api: res.locals.api,
    email: res.locals.email,
    logger,
  };
};
