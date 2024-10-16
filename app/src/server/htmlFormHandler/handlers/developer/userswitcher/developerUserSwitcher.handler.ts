import { DeveloperHomePage } from "@ui/pages/developer/home.page";
import { DeveloperUserSwitcherPage } from "@ui/pages/developer/UserSwitcher.page";
import express from "express";
import { configuration } from "@server/features/common/config";
import { IFormHandler } from "@server/htmlFormHandler/formHandlerBase";

export class DeveloperUserSwitcherHandler implements IFormHandler {
  public readonly routePath = DeveloperUserSwitcherPage.routePath;
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

    const dto = {
      user: req.body.user,
      projectId: req.body.project_id,
      buttonStay: req.body.stay === "",
      buttonHome: req.body.home === "",
      isSearch: req.body.search === "",
      isReset: req.body.reset === "",
      isResetSearchProjects: req.body.reset_search_projects === "",
      isSearchProjects: req.body.search_projects === "",
      searchQuery: req.body.search_query ?? "",
      currentUrl: req.body.current_url,
    };

    if (!req.session) req.session = {};
    if (!req.session.user) req.session.user = {};

    if (dto.isReset) {
      req.session.user.email = configuration.salesforceServiceUser.serviceUsername;
      req.session.user.projectId = undefined;
    } else if ("user" in dto && dto.user) {
      req.session.user.email = dto.user;
      req.session.user.projectId = undefined;
    }

    if ("projectId" in dto && dto.projectId) {
      req.session.user.projectId = dto.projectId;
    }

    if (dto.isResetSearchProjects) {
      req.session.user.userSwitcherSearchQuery = "";
    } else {
      req.session.user.userSwitcherSearchQuery = dto.searchQuery;
    }

    if (dto.buttonHome) {
      res.redirect("/");
    } else if (dto.buttonStay || dto.isResetSearchProjects || dto.isSearchProjects || dto.isSearch) {
      res.redirect(dto.currentUrl);
    } else {
      res.redirect(DeveloperHomePage.routePath);
    }
  }
}
