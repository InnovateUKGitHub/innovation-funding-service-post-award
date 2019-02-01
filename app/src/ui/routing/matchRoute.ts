import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { HomeRoute } from "../containers";
import { AsyncThunk, DataLoadAction } from "../redux/actions";
import React from "react";
import { Authorisation } from "../../types";

export interface MatchedRoute {
  name: string;
  path: string;
  accessControl?: (auth: Authorisation, params: {}) => boolean;
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
