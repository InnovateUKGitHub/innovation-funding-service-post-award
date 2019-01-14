import { actions as routeActions } from "redux-router5";
import { ILinkInfo } from "../../../types/ILinkInfo";

export function navigateTo(routeInfo: ILinkInfo) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams);
}
