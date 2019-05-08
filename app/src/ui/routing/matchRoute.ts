import React from "react";
import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { AsyncThunk, DataLoadAction } from "../redux/actions";
import { ErrorNotFoundRoute } from "../containers";
import { Authorisation } from "../../types";
import { RootState } from "../redux";
import { PageTitleState } from "../redux/reducers/pageTitleReducer";

export interface MatchedRoute {
  name: string;
  path: string;
  accessControl?: (auth: Authorisation, params: {}, features: IFeatureFlags) => boolean;
  getParams: (route: State) => {};
  getLoadDataActions: (params: {}, auth: Authorisation) => AsyncThunk<DataLoadAction | void>[];
  container: React.ComponentClass<any>;
  getTitle: (store: RootState, params: {}) => PageTitleState;
}

export function matchRoute(route: State | null | undefined): MatchedRoute {
  const found = Object.keys(routeConfig).map(x => x as RouteKeys).map(x => routeConfig[x]).find(x => x.routeName === (route && route.name)) || ErrorNotFoundRoute;
  return {
    name: found.routeName,
    path: found.routePath,
    getParams: found.getParams,
    getLoadDataActions: found.getLoadDataActions as (params: {}, auth: Authorisation) => AsyncThunk<any>[],
    accessControl: found.accessControl as (auth: Authorisation, params: {}, features: IFeatureFlags) => boolean,
    container: found.container,
    getTitle: found.getTitle as (store: RootState, params: {}) => PageTitleState
  };
}
