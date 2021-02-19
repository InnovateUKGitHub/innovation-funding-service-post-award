import { Dispatch, MiddlewareAPI } from "redux";
import { actionTypes } from "redux-router5";
import { RootState } from "../reducers/rootReducer";
import { RootActions } from "../actions/root";

// there seems to be a problem with reactrouter 5 seeing a hash navigation (<a href="#xxx"/>) as a actuall navigation
// this cancels it for the moment
export const cancelHashNavigation = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (
  action: RootActions,
) => {
  if (
    (action.type === actionTypes.TRANSITION_START || action.type === actionTypes.TRANSITION_SUCCESS) &&
    action.payload.previousRoute?.path === action.payload.route.path
  ) {
    return;
  }
  next(action);
};
