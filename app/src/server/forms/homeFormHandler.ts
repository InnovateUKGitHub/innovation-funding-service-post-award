import express from "express";
import { configureRouter, routeConfig } from "../../ui/routing";
import { HomeRoute } from "../../ui/containers";
import { configuration } from "../features/common/config";
import { IFormHandler } from "./formHandlerBase";

// @TODO: Remove as provides a back door to set the current user.....
export class HomeFormHandler implements IFormHandler {
  public readonly routePath = HomeRoute.routePath;
  public readonly middleware: express.RequestHandler[] = [];

  public async handle(req: express.Request, res: express.Response): Promise<void> {
    const dto = {
      user: ((req.body.user as string) || "").trim() || null,
      isReset: req.body.button_reset === "",
    };

    if (!req.session!.user) {
      req.session!.user = {};
    }

    if (dto.isReset) {
      req.session!.user.email = configuration.salesforce.serviceUsername;
    } else if (dto.user) {
      req.session!.user.email = dto.user;
    }

    const router = configureRouter(routeConfig);
    const url = router.buildPath(HomeRoute.routeName, {});
    res.redirect(url);
  }
}
