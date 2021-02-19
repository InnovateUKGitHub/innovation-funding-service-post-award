import { createRouter } from "router5";
import browserPluginFactory from "router5/plugins/browser";
import { IRoutes, RouteKeys } from "./routeConfig";

export function configureRouter(routes: IRoutes) {
  const mapped = Object.keys(routes)
      .map(x => x as RouteKeys)
      .map((k) => routes[k])
      .map(r => ({
        name: r.routeName,
        path: r.routePath,
      }));

  return createRouter(mapped, { allowNotFound: true })
    .usePlugin(browserPluginFactory({ useHash: false }));
}
