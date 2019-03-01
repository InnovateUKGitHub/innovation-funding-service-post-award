import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { configureRouter } from "../../ui/routing";
import { HomeRoute } from "../../ui/containers";
import { Configuration } from "../features/common/config";

// ToDo: Remove as provides a back door to set the current user.....
export class HomeFormHandler implements IFormHandler {

  public readonly routePath = HomeRoute.routePath;
  public readonly middleware: express.RequestHandler[] = [];

  public async handle(req: express.Request, res: express.Response): Promise<void> {
    const dto = { user: (req.body.user as string || "").trim() || null, isReset: req.body.button_reset === "" };

    if (dto.isReset) {
      req.session!.user.email = Configuration.salesforce.username;
    }
    else if (dto.user) {
      req.session!.user.email = dto.user;
    }

    const router = configureRouter();
    const url = router.buildPath(HomeRoute.routeName, {});
    res.redirect(url);
    return;
  }
}
