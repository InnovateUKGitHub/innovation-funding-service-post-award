import { Logger } from "@shared/developmentLogger";
import { AnyAction, Dispatch } from "redux";

const logger = new Logger("Redux");

export const loggingMiddleware = () => (next: Dispatch) => (action: AnyAction) => {
  logger.debug("Running action", action.type, action.payload);
  next(action);
};
