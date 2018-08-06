import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import { router5Middleware } from "redux-router5";

export function setupMiddleware(router: any) {
  return applyMiddleware(
    thunk,
    router5Middleware(router)
  );
}
