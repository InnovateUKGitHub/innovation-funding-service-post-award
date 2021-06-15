import { AnyAction, Dispatch } from "redux";

export const loggingMiddleware = () => (next: Dispatch) => (action: AnyAction) => {
  console.log("Running action", action.type, action.payload);
  next(action);
};
