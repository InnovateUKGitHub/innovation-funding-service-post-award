import { Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { RootActions } from "@ui/redux/actions/root";
import { scrollToTheTopInstantly } from "@framework/util/windowHelpers";

export const messagesMiddleware =
  (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: RootActions) => {
    if (action.type === "ROUTE_TRANSITION") {
      const hasMessages = store.getState().messages.filter(x => x.ttl > 0).length > 0;
      if (hasMessages) scrollToTheTopInstantly();
    }
    next(action);
  };
