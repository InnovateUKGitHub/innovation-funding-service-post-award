import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { BadRequestError, NotFoundError } from "../features/common/appError";
import { Logger } from "@server/features/common";

export class BadRequestHandler implements IFormHandler {
  public routePath = "*";
  public middleware = [];

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction) {
    // If the route has been matched but has fallen through to here it means that there was no suitable handler
    if (res.locals.isMatchedRoute) {
      const buttons = Object.keys(req.body).filter(x => x.startsWith("button_"));

      new Logger().error("No handler for", req.url, buttons);
      next(new BadRequestError());
    }
    else {
      next(new NotFoundError());
    }
  }
}
