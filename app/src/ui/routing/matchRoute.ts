import React from "react";
import { State } from "router5";
import { routeConfig, RouteKeys } from "./routeConfig";
import { ErrorNotFoundRoute } from "@ui/containers";
import { IStores } from "@ui/redux";
import { PageTitleState } from "@ui/redux/reducers/pageTitleReducer";
import { Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Content } from "@content/content";
import { IRouteDefinition } from "../containers/containerBase";

export interface MatchedRoute {
  routeName: string;
  accessControl?: (auth: Authorisation, params: {}, config: IClientConfig) => boolean;
  getParams: (route: State) => {};
  container: React.FunctionComponent<any>;
  getTitle: (getTitleArgs: { params: {}, stores: IStores, content: Content }) => PageTitleState;
}

export function matchRoute(route: State | null | undefined): MatchedRoute {
  const matched = Object.keys(routeConfig)
    .map(x => x as RouteKeys)
    .map(x => routeConfig[x] as IRouteDefinition<{}>)
    .find(x => x.routeName === (route && route.name))
    ;

  return matched || ErrorNotFoundRoute;
}
