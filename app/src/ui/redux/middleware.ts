import { thunk } from "redux-thunk";
import { applyMiddleware } from "redux";

import { loadStatusMiddleware } from "@ui/redux/middleware/loadStatusMiddleware";
import { loggingMiddleware } from "@ui/redux/middleware/loggingMiddleware";

// const baseMiddleWares = [thunk];

export const setupServerMiddleware = () => applyMiddleware(thunk);

export const setupClientMiddleware = () => applyMiddleware(thunk, loggingMiddleware, loadStatusMiddleware);
