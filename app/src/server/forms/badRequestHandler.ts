import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { BadRequestError } from "../features/common/appError";

export class BadRequestHandler implements IFormHandler {
  public routePath = "*";
  public middleware = [];

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction) {
    // If the route has been matched but has fallen through to here it means that there was no suitable handler
    if (res.locals.isMatchedRoute) throw new BadRequestError();
    return next();
  }
}
