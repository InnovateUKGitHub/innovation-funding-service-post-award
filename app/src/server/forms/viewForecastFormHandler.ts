import express from "express";
import { IFormHandler } from "./formHandlerBase";
import { configureRouter, routeConfig } from "../../ui/routing";
import { ForecastDetailsRoute } from "@ui/containers/forecasts/details";

export class ViewForecastFormHandler implements IFormHandler {
  public routePath = ForecastDetailsRoute.routePath;
  public middleware = [];

  public handle(req: express.Request, res: express.Response): Promise<void> {
    const routes = routeConfig;

    const { projectId, partnerId } = routes.forecastDetails.getParams({ name: ForecastDetailsRoute.routeName, params: req.params, path: req.path });

    const router = configureRouter(routes);
    const redirectLink = routes.forecastUpdate.getLink({ projectId, partnerId });
    const url = router.buildPath(redirectLink.routeName, redirectLink.routeParams);
    res.redirect(url);
    return Promise.resolve();
  }

}
