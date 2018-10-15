import { actions as routeActions } from "redux-router5";

export function navigateTo(routeInfo: ILinkInfo) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams);
}
