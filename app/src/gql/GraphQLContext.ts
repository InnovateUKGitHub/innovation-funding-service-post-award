import { Logger } from "@shared/developmentLogger";
import { Response } from "express";
import { Api } from "./sfdc-graphql-endpoint/src/sfdc/api";
import { Connection } from "./sfdc-graphql-endpoint/src/sfdc/connection";

interface GraphQLContext {
  api: Api;
  connection: Connection;
  email: string | null;
  logger: Logger;

  [key: string | symbol]: unknown;
}

const createContext = ({ res, logger }: { res: Response; logger: Logger }): GraphQLContext => {
  return {
    api: res.locals.api,
    connection: res.locals.connection,
    email: res.locals.email,
    logger,
  };
};

export { GraphQLContext, createContext };
