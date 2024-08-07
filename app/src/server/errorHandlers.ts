import { ErrorCode } from "@framework/constants/enums";
import { IAppDetailedError, IAppError } from "@framework/types/IAppError";

export const getErrorStatus = (err?: Pick<IAppError, "stack" | "code" | "message">) => {
  const code = err ? err.code : ErrorCode.UNKNOWN_ERROR;

  switch (code) {
    case ErrorCode.VALIDATION_ERROR:
      return 400;
    case ErrorCode.BAD_REQUEST_ERROR:
      return 400;
    case ErrorCode.FORBIDDEN_ERROR:
      return 403;
    case ErrorCode.REQUEST_ERROR:
      return 404;
    case ErrorCode.SECURITY_ERROR:
      return 503;
    case ErrorCode.SFDC_ERROR:
      return 500;
    case ErrorCode.UNKNOWN_ERROR:
    default:
      return 500;
  }
};

export interface ClientErrorResponse {
  code?: ErrorCode;
  message?: string;
  results?: AnyObject[] | null;
  details?: IAppDetailedError[];
  cause?: ClientErrorResponse | null;
  stack?: string | null;
  traceId: string;
}

export const getErrorResponse = (err: unknown, traceId: string): ClientErrorResponse => {
  const isError = err instanceof Error;

  const code = isError && "code" in err ? (err.code as ErrorCode) : ErrorCode.UNKNOWN_ERROR;
  const message = isError && "message" in err ? err.message : "Something went wrong";
  const results = isError && "results" in err ? (err.results as AnyObject[]) : null;
  const details = isError && "details" in err ? (err.details as IAppDetailedError[]) : [];
  const cause = isError && err?.cause ? getErrorResponse(err.cause, traceId) : null;
  const stack = isError && err ? (err.stack as string) : null;

  return { code, message, results, details, stack, cause, traceId };
};
