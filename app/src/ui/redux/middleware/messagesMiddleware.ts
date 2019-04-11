import { Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "../reducers/rootReducer";
import { RootActions } from "../actions/root";
import { scrollToTheTopInstantly, scrollToTheTopSmoothly } from "../../../util/windowHelpers";
import { actionTypes } from "redux-router5";

export const messagesMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
  if(action.type === actionTypes.TRANSITION_SUCCESS) {
    const hasMessages = store.getState().messages.filter(x => x.ttl > 0).length > 0;
    if (hasMessages) scrollToTheTopInstantly();
  }
  next(action);
};
