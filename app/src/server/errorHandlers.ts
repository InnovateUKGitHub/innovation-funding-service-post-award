import { ErrorCode, IAppError } from "@framework/types";
import { Logger } from "./features/common/logger";
import { ValidationError } from "./features/common";

const log = new Logger();

export const getErrorStatus = (err?: IAppError) => {
  const code = err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const validationError = err as ValidationError;
  const message = validationError.results && validationError.results.log() || err && err.message || "";

  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      log.info("BAD_REQUEST_ERROR", message);
      return 400;
    case ErrorCode.BAD_REQUEST_ERROR:
      log.info("BAD_REQUEST_ERROR", err);
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      log.warn("FORBIDDEN_ERROR", err);
      return 403;
    case ErrorCode.REQUEST_ERROR:
      log.info("REQUEST_ERROR", err);
      return 404;
    case ErrorCode.SECURITY_ERROR:
      log.error("SECURITY_ERROR", err);
      return 503;
    case ErrorCode.UNKNOWN_ERROR:
    default:
      log.error("UNKNOWN_ERROR", err);
      return 500;
  }
};

export const getErrorResponse = (err: IAppError) => {
  const code = err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const message = err ? err.message : "Something went wrong";
  const results = err ? err.results : null;

  return { code, message, results };
};
