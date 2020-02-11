import { ErrorCode, IAppError } from "@framework/types";
import { Logger } from "./features/common/logger";
import { ValidationError } from "./features/common";

const Log = new Logger();

export const getErrorStatus = (err?: IAppError) => {
  const code = !!err ? err.code : ErrorCode.UNKNOWN_ERROR;

  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      const validationError = err as ValidationError;
      const message = validationError.results && validationError.results.log() || err && err.message || "";
      Log.info("BAD_REQUEST_ERROR", message);
      return 400;
    case ErrorCode.BAD_REQUEST_ERROR:
      Log.info("BAD_REQUEST_ERROR", err);
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      Log.warn("FORBIDDEN_ERROR", err);
      return 403;
    case ErrorCode.REQUEST_ERROR:
      Log.info("REQUEST_ERROR", err);
      return 404;
    case ErrorCode.SECURITY_ERROR:
      Log.error("SECURITY_ERROR", err);
      return 503;
    case ErrorCode.UNKNOWN_ERROR:
    default:
      Log.error("UNKNOWN_ERROR", err);
      return 500;
  }
};

export const getErrorResponse = (err: IAppError) => {
  const code = !!err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const message = !!err ? err.message : "Something went wrong";
  const results = !!err ? err.results : null;

  return { code, message, results };
};
