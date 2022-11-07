import type { FunctionComponent } from "react";
import { ErrorNotFoundRoute } from "@ui/containers";
import { IStores } from "@ui/redux";
import { Authorisation } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { Copy } from "@copy/Copy";
import type { RouteState } from "../containers/containerBase";
import { routeConfig } from "./routeConfig";

export interface MatchedRoute {
  routeName: string;
  accessControl?: (auth: Authorisation, params: AnyObject, config: IClientConfig) => boolean;
  getParams: (route: RouteState) => RouteState["params"];
  container: FunctionComponent<unknown>;
  getTitle: (getTitleArgs: { params: AnyObject; stores: IStores; content: Copy }) => {
    htmlTitle: string;
    displayTitle: string;
  };
  allowRouteInActiveAccess?: true;
}

const toRegexpMatcher = (routePath: string) => {
  const matcher = routePath.replace(/:\w+/g, "\\w+");
  return new RegExp(`^${matcher}$`);
};

export const availableRoutesWithPatternMatchers = Object.values(routeConfig).map(x => ({
  ...x,
  patternMatcher: toRegexpMatcher(x.routePath),
}));

/**
 * Returns matched route against the passed in string
 * Note: matchRoute doesn't check if the route is valid but the FormHandler is missing
 * TODO: check performance of this
 */
export function matchRoute(routeToCheck: string) {
  const foundRoute = availableRoutesWithPatternMatchers.find(x => x.patternMatcher.test(routeToCheck));
  return foundRoute ?? ErrorNotFoundRoute;
}
