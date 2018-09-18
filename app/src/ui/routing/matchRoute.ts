import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { HomeRoute } from "../containers";
import { AsyncThunk } from "../redux/actions";
import React from "react";

export function matchRoute(route: State | null | undefined): { name: string, path: string, getParams: (route: State) => {}, getLoadDataActions: (params: {}) => AsyncThunk<any>[], container: React.ComponentClass<any> } {
  const found = Object.keys(routeConfig).map(x => x as RouteKeys).map(x => routeConfig[x]).find(x => x.routeName === (route && route.name)) || HomeRoute;
  return {
    name: found.routeName,
    path: found.routePath,
    getParams: found.getParams,
    getLoadDataActions: found.getLoadDataActions as (params: {}) => AsyncThunk<any>[],
    container: found.container
  };
}

/*export function matchRouteLoader(route: State | undefined): (route: State, params: {}) => AsyncThunk<any>[] {
  const match = matchRoute(route) || defaultRoute();
  if(match.component.getLoadDataActions) {
    return match.component.getLoadDataActions;
  }
  return () => [];
}*/
