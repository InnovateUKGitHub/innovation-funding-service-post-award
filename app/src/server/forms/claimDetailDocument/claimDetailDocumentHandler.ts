import express, { RequestHandler } from "express";
import { IFormHandler } from "../formHandlerBase";
import { ClaimDetailDocumentsRoute } from "../../../ui/containers";
import { ClaimDetailDocumentUploadHandler } from "./claimDetailDocumentUploadHandler";
import { ClaimDetailDocumentDeleteHandler } from "./claimDetailDocumentDeleteHandler";

export class ClaimDetailDocumentHandler implements IFormHandler {
  readonly routePath: string;
  readonly middleware: RequestHandler[];

  private deleteHandler: ClaimDetailDocumentDeleteHandler;
  private uploadHandler: ClaimDetailDocumentUploadHandler;

  constructor(middleware: RequestHandler[]) {
    this.routePath     = ClaimDetailDocumentsRoute.routePath;
    this.middleware    = middleware;
    this.deleteHandler = new ClaimDetailDocumentDeleteHandler();
    this.uploadHandler = new ClaimDetailDocumentUploadHandler();
  }

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    if(!!req.body.button_delete) {
      return this.deleteHandler.handle(req, res, next);
    }

    return this.uploadHandler.handle(req, res, next);
  }
}
