import { State } from "router5";
import { AsyncRoute, routeConfig, RouteKeys } from "./routeConfig";
import { Home } from "../containers";

export function matchRoute(route: State | undefined): AsyncRoute {
  const name  = route && route.name as RouteKeys;
  const match = name && routeConfig[name] || routeConfig.error;

  return match;
}

export function matchRouteLoader(route: State | undefined) {
  const match = matchRoute(route);
  return !!match.loadData ? match.loadData : () => Promise.resolve({});
}
