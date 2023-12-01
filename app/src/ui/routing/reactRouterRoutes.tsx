import { RouteObject, createBrowserRouter } from "react-router-dom";
import { createStaticRouter } from "react-router-dom/server";
import { routeConfig } from "./routeConfig";
import { AppView } from "@ui/containers/app";

type ReactRouterRouter = ReturnType<typeof createBrowserRouter | typeof createStaticRouter>;

const reactRouterRoutes: RouteObject[] = Object.values(routeConfig).map(route => ({
  path: route.routePath,
  element: <AppView currentRoute={route} />,
  id: route.routeName,
  action: () => null,
}));

export { ReactRouterRouter, reactRouterRoutes };
