import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import { router5Middleware } from "redux-router5";
import { Router } from "router5";

export function setupMiddleware(router: Router) {
  return applyMiddleware(
    thunk,
    router5Middleware(router)
  );
}
