import { ErrorCode } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import { Logger } from "@shared/developmentLogger";
import { ValidationError } from "./features/common/appError";

const log = new Logger("Error Status");

export const getErrorStatus = (err?: IAppError) => {
  const code = err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const validationError = err as ValidationError;
  const message = validationError.results?.log() ?? err?.message ?? "";
  const stack = err?.stack ?? "No stack provided";

  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      log.info("VALIDATION_ERROR", message);
      return 400;
    case ErrorCode.BAD_REQUEST_ERROR:
      log.info("BAD_REQUEST_ERROR", err, stack);
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      log.warn("FORBIDDEN_ERROR", err, stack);
      return 403;
    case ErrorCode.REQUEST_ERROR:
      log.info("REQUEST_ERROR", err, stack);
      return 404;
    case ErrorCode.SECURITY_ERROR:
      log.error("SECURITY_ERROR", err, stack);
      return 503;
    case ErrorCode.UNKNOWN_ERROR:
    default:
      log.error("UNKNOWN_ERROR", err, stack);
      return 500;
  }
};

export const getErrorResponse = (err: IAppError) => {
  const code = err ? err.code : ErrorCode.UNKNOWN_ERROR;
  const message = err ? err.message : "Something went wrong";
  const results = err ? err.results : null;

  return { code, message, results };
};
