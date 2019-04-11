import thunk from "redux-thunk";
import { AnyAction, applyMiddleware, Dispatch } from "redux";
import { router5Middleware } from "redux-router5";
import { Router } from "router5";
import { loadStatusMiddleware } from "./middleware/loadStatusMiddleware";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import { cancelHashNavigation } from "./middleware/cancelHashNavigation";
import { cancelInitialNavigation } from "./middleware/cancelInitialNavigation";
import { messagesMiddleware } from "./middleware/messagesMiddleware";

// used as replacement for optional middleware
const noopMiddleware = () => (next: Dispatch) => (action: AnyAction) => next(action);

export function setupMiddleware(router: Router, isClient: boolean) {
  return applyMiddleware(
    thunk,
    cancelInitialNavigation,
    cancelHashNavigation,
    isClient ? loggingMiddleware : noopMiddleware,
    router5Middleware(router),
    isClient ? messagesMiddleware : noopMiddleware,
    isClient ? loadStatusMiddleware : noopMiddleware
  );
}
