import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { UpdateForecastRoute, ViewForecastRoute } from "../../ui/containers";
import { configureRouter } from "../../ui/routing";

export class ViewForecastFormHandler implements IFormHandler {
  public routePath = ViewForecastRoute.routePath;
  public middleware = [];

  public handle(req: express.Request, res: express.Response): Promise<void> {
    const params = ViewForecastRoute.getParams({ name: ViewForecastRoute.routeName, params: req.params, path: req.path });

    const redirectLink = UpdateForecastRoute.getLink(params);

    const router = configureRouter();
    const url = router.buildPath(redirectLink.routeName, redirectLink.routeParams);
    res.redirect(url);
    return Promise.resolve();
  }

}
