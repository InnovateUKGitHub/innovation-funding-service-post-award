import { State } from "router5";
import { AsyncRoute, routeConfig, RouteKeys } from "./routeConfig";
import { Home } from "../containers";
import { promises } from "fs";

function defaultRoute(): AsyncRoute {
  return {
    name: "home",
    path: "/",
    component: Home,
  };
}

export function matchRoute(route: State | undefined): AsyncRoute {
  const name = route && route.name as RouteKeys;
  const match = name && routeConfig[name] || routeConfig.error;

  return match;
}

export function matchRouteLoader(route: State | undefined) {
  const match = matchRoute(route) || defaultRoute();
  if (!match.loadData) {
    match.loadData = () => []
  }
  return match.loadData;
}
