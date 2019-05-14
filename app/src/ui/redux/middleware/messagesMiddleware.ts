import { Dispatch, MiddlewareAPI } from "redux";
import { actionTypes } from "redux-router5";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { RootActions } from "@ui/redux/actions/root";
import { scrollToTheTopInstantly } from "@framework/util";

export const messagesMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
  if(action.type === actionTypes.TRANSITION_SUCCESS) {
    const hasMessages = store.getState().messages.filter(x => x.ttl > 0).length > 0;
    if (hasMessages) scrollToTheTopInstantly();
  }
  next(action);
};
