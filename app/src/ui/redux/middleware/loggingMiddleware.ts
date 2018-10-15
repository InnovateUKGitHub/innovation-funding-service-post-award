import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { RootState } from "../reducers/rootReducer";

export const loggingMiddleware = (store: MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: AnyAction) => {
  console.log("Running action", action.type, action.payload);
  next(action);
};
