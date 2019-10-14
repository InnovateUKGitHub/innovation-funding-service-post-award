import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { UpdateForecastRoute, ViewForecastRoute } from "../../ui/containers";
import { configureRouter, routeConfig } from "../../ui/routing";

export class ViewForecastFormHandler implements IFormHandler {
  public routePath = ViewForecastRoute.routePath;
  public middleware = [];

  public handle(req: express.Request, res: express.Response): Promise<void> {
    const routes = routeConfig;

    const { projectId, partnerId } = routes.viewForecast.getParams({ name: ViewForecastRoute.routeName, params: req.params, path: req.path });

    const router = configureRouter(routes);
    const redirectLink = routes.updateForecast.getLink({ projectId, partnerId });
    const url = router.buildPath(redirectLink.routeName, redirectLink.routeParams);
    res.redirect(url);
    return Promise.resolve();
  }

}
