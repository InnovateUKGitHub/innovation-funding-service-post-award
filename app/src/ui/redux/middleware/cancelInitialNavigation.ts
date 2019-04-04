import { Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "../reducers/rootReducer";
import { RootActions } from "../actions/root";

// this cancels the initial navigation that is unnessary as its rendered on the server
export const cancelInitialNavigation = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
  if ((action.type === "@@router5/TRANSITION_START" || action.type === "@@router5/TRANSITION_SUCCESS") && !action.payload.previousRoute) {
    return;
  }
  next(action);
};
