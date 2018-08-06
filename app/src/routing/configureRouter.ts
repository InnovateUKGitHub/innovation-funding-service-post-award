import { createRouter } from "router5";
import { routeConfig } from "./routeConfig";
import browserPluginFactory from "router5/plugins/browser";

export function configureRouter() {
  return createRouter(routeConfig)
    .usePlugin(browserPluginFactory({ useHash: false }));
}
