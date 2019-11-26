import { actions as routeActions } from "redux-router5";
import { ILinkInfo } from "@framework/types/ILinkInfo";

export function navigateTo(routeInfo: ILinkInfo, replace: boolean = false) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams, { replace });
}
