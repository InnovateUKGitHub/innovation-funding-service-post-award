import thunk from "redux-thunk";
import { applyMiddleware } from "redux";

import { loadStatusMiddleware } from "@ui/redux/middleware/loadStatusMiddleware";
import { loggingMiddleware } from "@ui/redux/middleware/loggingMiddleware";
import { messagesMiddleware } from "@ui/redux/middleware/messagesMiddleware";

const baseMiddleWares = [thunk];

export const setupServerMiddleware = () => applyMiddleware(...baseMiddleWares);

export const setupClientMiddleware = () =>
  applyMiddleware(...baseMiddleWares, loggingMiddleware, messagesMiddleware, loadStatusMiddleware);
