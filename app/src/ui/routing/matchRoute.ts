import { ErrorNotFoundRoute } from "@ui/containers/errors.page";
import { routeConfig } from "./routeConfig";

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
