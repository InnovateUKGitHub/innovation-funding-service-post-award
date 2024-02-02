import { ErrorCode } from "@framework/constants/enums";
import {
  BadRequestError,
  ConfigurationError,
  FormHandlerError,
  InActiveProjectError,
  NotFoundError,
  UnauthenticatedError,
  ForbiddenError,
} from "@shared/appError";
import { DeveloperPageCrasherPage } from "@ui/containers/pages/developer/PageCrasher.page";
import express from "express";
import { configuration } from "@server/features/common/config";
import { IFormHandler } from "@server/htmlFormHandler/formHandlerBase";

export class DeveloperPageCrasherHandler implements IFormHandler {
  public readonly routePath = DeveloperPageCrasherPage.routePath;
  public readonly middleware: express.RequestHandler[] = [];

  public async handle({
    req,
    res,
    next,
  }: {
    req: express.Request;
    res: express.Response;
    next: express.NextFunction;
  }): Promise<void> {
    // Pretend this handler does not exist if we happen to run it
    // outside of a development environment.
    if (configuration.sso.enabled) return next();

    switch (req.body.button_crashType) {
      case "Error":
        throw new Error("This page has crashed on purpose.");
      case "NotFoundError":
        throw new NotFoundError();
      case "ForbiddenError":
        throw new ForbiddenError();
      case "InActiveProjectError":
        throw new InActiveProjectError();
      case "BadRequestError":
        throw new BadRequestError();
      case "UnauthenticatedError":
        throw new UnauthenticatedError();
      case "ConfigurationError":
        throw new ConfigurationError("This page has crashed on purpose.");
      case "FormHandlerError":
        throw new FormHandlerError("test", "test", null, null, {
          code: ErrorCode.UNKNOWN_ERROR,
          message: "This page has crashed on purpose.",
          details: [],
        });
    }

    res.redirect(DeveloperPageCrasherPage.routePath);
  }
}
