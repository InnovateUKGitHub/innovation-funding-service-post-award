import { actions as routeActions } from "redux-router5";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import * as Actions from "@ui/redux/actions/common";

export function navigateTo(routeInfo: ILinkInfo, replace: boolean = false) {
  return routeActions.navigateTo(routeInfo.routeName, routeInfo.routeParams, { replace });
}

// Use navigateBackTo when navigating back from a submitted form to avoid leaving the form url in the browser history.
// Avoids the user landing back on the form if they click the back button
export const navigateBackTo = (routeInfo: ILinkInfo): Actions.AsyncThunk<void> => (dispatch, getState): any => {
  // if (getState().history > 0) {
  //   return window.history.back();
  // }
  return dispatch(navigateTo(routeInfo, true));
};
