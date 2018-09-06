import thunk from "redux-thunk";
import { applyMiddleware, Dispatch, AnyAction } from "redux";
import { router5Middleware } from "redux-router5";
import { Router } from "router5";
import { loadStatusMiddleware } from "./middleware/loadStatusMiddleware";

const noopMiddleware = () => (next:Dispatch) => (action:AnyAction) => next(action);

export function setupMiddleware(router: Router, isClient: boolean) {
  return applyMiddleware(
    thunk,
    router5Middleware(router),
    isClient ? loadStatusMiddleware : noopMiddleware
  );
}
