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
      log.info("Validation Error", message);
      return 400;
    case ErrorCode.BAD_REQUEST_ERROR:
      log.info("Bad Request Error", err, stack);
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      log.warn("Forbidden Error", err, stack);
      return 403;
    case ErrorCode.REQUEST_ERROR:
      log.info("Request Error", err, stack);
      return 404;
    case ErrorCode.SECURITY_ERROR:
      log.error("Security Error", err, stack);
      return 503;
    case ErrorCode.SFDC_ERROR:
      log.error("Salesforce Error", err, stack);
      return 500;
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
  const details = err ? err.details : [];

  return { code, message, results, details };
};
