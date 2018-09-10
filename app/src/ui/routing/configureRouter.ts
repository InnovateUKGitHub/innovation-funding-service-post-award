import { createRouter } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import browserPluginFactory from "router5/plugins/browser";

export function configureRouter() {
  const rKeys  = Object.keys(routeConfig) as RouteKeys[];
  const routes = rKeys.map((k) => routeConfig[k]);

  return createRouter(routes)
    .usePlugin(browserPluginFactory({ useHash: false }));
}
