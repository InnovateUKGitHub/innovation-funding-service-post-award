import express from "express";
import { Logger } from "@shared/developmentLogger";
import { BadRequestError, NotFoundError } from "../features/common/appError";
import { IFormHandler } from "./formHandlerBase";
import { serverRender } from "@server/serverRender";
import { GraphQLSchema } from "graphql";

export class FallbackFormHandler implements IFormHandler {
  public logger = new Logger("Bad Request");
  public routePath = "*";
  public middleware = [];

  private readonly schema: GraphQLSchema;

  constructor({ schema }: { schema: GraphQLSchema }) {
    this.schema = schema;
  }

  public async handle({ req, res, next }: { req: express.Request; res: express.Response; next: express.NextFunction }) {
    // If a form has already succeeded, we should ignore the bad request.
    if (res.locals.isFormSuccess) {
      return serverRender({ schema: this.schema })({ req, res, err: null, next });
    }

    if (res.locals.isMatchedRoute) {
      // If the route has been matched but has fallen through to here it means that there was no suitable handler
      const buttons = Object.keys(req.body).filter(x => x.startsWith("button_"));

      this.logger.error(`Missing handler for endpoint ${req.url}`, buttons);
      return next(new BadRequestError());
    }

    return next(new NotFoundError());
  }
}
