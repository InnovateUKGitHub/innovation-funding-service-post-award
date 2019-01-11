import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { HomeRoute } from "../containers";
import { AsyncThunk, DataLoadAction } from "../redux/actions";
import React from "react";
import { IUser } from "../../types/IUser";

export interface MatchedRoute {
  name: string;
  path: string;
  accessControl?: (user: IUser, params: {}) => boolean;
  getParams: (route: State) => {};
  getLoadDataActions: (params: {}) => AsyncThunk<DataLoadAction | void>[];
  container: React.ComponentClass<any>;
}

export function matchRoute(route: State | null | undefined): MatchedRoute {
  const found = Object.keys(routeConfig).map(x => x as RouteKeys).map(x => routeConfig[x]).find(x => x.routeName === (route && route.name)) || HomeRoute;
  return {
    name: found.routeName,
    path: found.routePath,
    getParams: found.getParams,
    getLoadDataActions: found.getLoadDataActions as (params: {}) => AsyncThunk<any>[],
    accessControl: found.accessControl as (params: {}) => boolean,
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
