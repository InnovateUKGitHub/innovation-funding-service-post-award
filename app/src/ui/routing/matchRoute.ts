import React from "react";
import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { ErrorNotFoundRoute } from "@ui/containers";
import { IStores, RootState } from "@ui/redux";
import { PageTitleState } from "@ui/redux/reducers/pageTitleReducer";
import { Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Content } from "@content/content";

export interface MatchedRoute {
  name: string;
  path: string;
  accessControl?: (auth: Authorisation, params: {}, config: IClientConfig) => boolean;
  getParams: (route: State) => {};
  container: React.FunctionComponent<any>;
  getTitle: (store: RootState, params: {}, stores: IStores, content: Content) => PageTitleState;
}

export function matchRoute(route: State | null | undefined): MatchedRoute {
  const found = Object.keys(routeConfig).map(x => x as RouteKeys).map(x => routeConfig[x]).find(x => x.routeName === (route && route.name)) || ErrorNotFoundRoute;
  return {
    name: found.routeName,
    path: found.routePath,
    getParams: found.getParams,
    accessControl: found.accessControl as (auth: Authorisation, params: {}, config: IClientConfig) => boolean,
    container: found.container,
    getTitle: found.getTitle as (store: RootState, params: {}, stores: IStores, content: Content) => PageTitleState
  };
}
