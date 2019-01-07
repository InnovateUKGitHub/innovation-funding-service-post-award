import express, { RequestHandler } from "express";
import { IFormHandler } from "../formHandlerBase";
import { ClaimDashboardDocumentDeleteHandler } from "./claimDashboardDocumentDeleteHandler";
import { ClaimDashboardDocumentUploadHandler } from "./claimDashboardDocumentUploadHandler";
import { ClaimsDashboardRoute } from "../../../ui/containers/claims";

export class ClaimDashboardDocumentHandler implements IFormHandler {
  readonly routePath: string;
  readonly middleware: RequestHandler[];

  private deleteHandler: ClaimDashboardDocumentDeleteHandler;
  private uploadHandler: ClaimDashboardDocumentUploadHandler;

  constructor(middleware: RequestHandler[]) {
    this.routePath = ClaimsDashboardRoute.routePath.split("?")[0];
    this.middleware = middleware;
    this.deleteHandler = new ClaimDashboardDocumentDeleteHandler();
    this.uploadHandler = new ClaimDashboardDocumentUploadHandler();
  }

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if (!!req.body.button_delete) {
      return this.deleteHandler.handle(req, res, next);
    }
    return this.uploadHandler.handle(req, res, next);
  }
}
