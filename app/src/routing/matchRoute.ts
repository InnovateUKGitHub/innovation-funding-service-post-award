import { State } from "router5";
import { AsyncRoute, routeConfig, RouteKeys } from "./routeConfig";
import { Home } from "../containers";
import { promises } from "fs";
import { AsyncThunk } from "../redux/actions";

function defaultRoute(): AsyncRoute {
  return {
    name: "home",
    path: "/",
    component: Home,
  };
}

export function matchRoute(route: State | undefined): AsyncRoute {
  const name = route && route.name as RouteKeys;
  return name && routeConfig[name] || routeConfig.error;
}

export function matchRouteLoader(route: State | undefined) : (route?: any) => AsyncThunk<any>[] {
  const match = matchRoute(route) || defaultRoute();
  if(match.component.loadData) {
    return match.component.loadData;
  }
  return () => [];
}
