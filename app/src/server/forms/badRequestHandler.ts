import express from "express";
import { Logger } from "@shared/developmentLogger";
import { BadRequestError, NotFoundError } from "../features/common/appError";
import { IFormHandler } from "./formHandlerBase";

export class BadRequestHandler implements IFormHandler {
  public logger = new Logger("Bad Request");
  public routePath = "*";
  public middleware = [];

  public async handle({ req, res, next }: { req: express.Request; res: express.Response; next: express.NextFunction }) {
    // If the route has been matched but has fallen through to here it means that there was no suitable handler
    if (res.locals.isMatchedRoute) {
      const buttons = Object.keys(req.body).filter(x => x.startsWith("button_"));

      this.logger.error(`Missing handler for endpoint ${req.url}`, buttons);
      next(new BadRequestError());
    } else {
      next(new NotFoundError());
    }
  }
}
