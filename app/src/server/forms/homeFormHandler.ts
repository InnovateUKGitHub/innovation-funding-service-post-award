import express = require("express");
import { IFormHandler } from "./formHandlerBase";
import { configureRouter } from "../../ui/routing";
import { HomeRoute } from "../../ui/containers";
import { RequestHandler } from "express";

// ToDo: Remove as provides a back door to set the current user.....
export class HomeFormHandler implements IFormHandler {

  public readonly routePath = HomeRoute.routePath;
  public readonly middleware: RequestHandler[] = [];

  public async handle(req: express.Request, res: express.Response): Promise<void> {
    const dto = { user: req.body.user };

    if (dto.user) {
        req.session!.user.email = dto.user;
    }

    const router = configureRouter();
    const url = router.buildPath(HomeRoute.routeName, {});
    res.redirect(url);
    return;
  }
}
