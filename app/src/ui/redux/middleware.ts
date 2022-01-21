import thunk from "redux-thunk";
import { applyMiddleware } from "redux";
import { router5Middleware } from "redux-router5";
import { Router } from "router5";

import { loadStatusMiddleware } from "@ui/redux/middleware/loadStatusMiddleware";
import { loggingMiddleware } from "@ui/redux/middleware/loggingMiddleware";
import { cancelHashNavigation } from "@ui/redux/middleware/cancelHashNavigation";
import { cancelInitialNavigation } from "@ui/redux/middleware/cancelInitialNavigation";
import { messagesMiddleware } from "@ui/redux/middleware/messagesMiddleware";
import { htmlTitleMiddleware } from "@ui/redux/middleware/htmlTitleMiddleware";

const baseMiddleWares = [thunk, cancelInitialNavigation, cancelHashNavigation];

export const setupServerMiddleware = (router: Router) => applyMiddleware(...baseMiddleWares, router5Middleware(router));

export const setupClientMiddleware = (router: Router) =>
  applyMiddleware(
    ...baseMiddleWares,
    loggingMiddleware,
    router5Middleware(router),
    messagesMiddleware,
    loadStatusMiddleware,
    htmlTitleMiddleware,
  );
