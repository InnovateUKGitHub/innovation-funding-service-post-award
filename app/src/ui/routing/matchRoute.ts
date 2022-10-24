import React from "react";
import { ErrorNotFoundRoute } from "@ui/containers";
import { IStores } from "@ui/redux";
import { Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Copy } from "@copy/Copy";
import type { RouteState, IRouteDefinition } from "../containers/containerBase";
import { routeConfig } from "./routeConfig";

export interface MatchedRoute {
  routeName: string;
  accessControl?: (auth: Authorisation, params: {}, config: IClientConfig) => boolean;
  getParams: (route: RouteState) => RouteState["params"];
  container: React.FunctionComponent<any>;
  getTitle: (getTitleArgs: { params: {}; stores: IStores; content: Copy }) => {
    htmlTitle: string;
    displayTitle: string;
  };
  allowRouteInActiveAccess?: true;
}

const toRegexpMatcher = (routePath: string) => {
  const matcher = routePath.replace(/:\w+/g, "\\w+");
  return new RegExp(`^${matcher}$`);
};

export const availableRoutesWithPatternMatchers = (Object.values(routeConfig) as unknown as IRouteDefinition<{}>[]).map(
  x => ({ ...x, patternMatcher: toRegexpMatcher(x.routePath) }),
);

// Note: matchRoute doesn't check if the route is valid but the FormHandler is missing
export function matchRoute(routeToCheck: string) {
  const foundRoute = availableRoutesWithPatternMatchers.find(x => x.patternMatcher.test(routeToCheck));
  return foundRoute ?? ErrorNotFoundRoute;
}
