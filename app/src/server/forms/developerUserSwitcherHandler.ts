import { DeveloperUserChangeDto } from "@framework/dtos/developerUserChange";
import express from "express";
import { HomeRoute } from "../../ui/containers";
import { configuration } from "../features/common/config";
import { IFormHandler } from "./formHandlerBase";

export class DeveloperUserSwitcherHandler implements IFormHandler {
  public readonly routePath = HomeRoute.routePath;
  public readonly middleware: express.RequestHandler[] = [];

  public async handle(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // Pretend this handler does not exist if we happen to run it
    // outside of a development environment.
    if (configuration.sso.enabled) return next();

    const dto = {
      user: req.body.user,
      buttonUser: req.body.button_user,
      projectId: req.body.project_id,
      currentUrl: req.body.button_stay === "" ? req.body.current_url : undefined,
      isSearch: req.body.button_search === "",
      isReset: req.body.reset === "",
    } as DeveloperUserChangeDto;

    if (!req.session) req.session = {};
    if (!req.session.user) req.session.user = {};

    if (dto.isReset) {
      req.session.user.email = configuration.salesforceServiceUser.serviceUsername;
      req.session.user.projectId = undefined;
    } else if ("isSearch" in dto && dto.isSearch) {
      req.session.user.projectId = dto.projectId;
    } else if ("user" in dto && dto.user) {
      req.session.user.email = dto.user;
      req.session.user.projectId = undefined;
    } else if ("buttonUser" in dto && dto.buttonUser) {
      req.session.user.email = dto.buttonUser;
      req.session.user.projectId = dto.projectId;
    }

    if (dto.currentUrl) {
      res.redirect(dto.currentUrl);
    } else {
      res.redirect(HomeRoute.routePath);
    }
  }
}
