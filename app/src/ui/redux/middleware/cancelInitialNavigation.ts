import { Dispatch, MiddlewareAPI } from "redux";
import { actionTypes } from "redux-router5";
import { RootState } from "../reducers/rootReducer";
import { RootActions } from "../actions/root";

// this cancels the initial navigation that is unnecessary as its rendered on the server
export const cancelInitialNavigation = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
  if ((action.type === actionTypes.TRANSITION_START || action.type === actionTypes.TRANSITION_SUCCESS) && !action.payload.previousRoute) {
    return;
  }
  next(action);
};
