import { createRouter } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import browserPluginFactory from "router5/plugins/browser";

export function configureRouter() {
  const routes = Object.keys(routeConfig)
      .map(x => x as RouteKeys)
      .map((k) => routeConfig[k])
      .map(r => ({
        name: r.routeName,
        path: r.routePath,
      }));

  return createRouter(routes, { allowNotFound: true })
    .usePlugin(browserPluginFactory({ useHash: false }));
}
