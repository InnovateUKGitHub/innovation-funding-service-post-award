import { ErrorCode } from "@framework/constants/enums";
import { IAppDetailedError, IAppError } from "@framework/types/IAppError";
import { mapValidationResultErrors } from "@shared/mapAppErrorDetails";
import { Results } from "@ui/validation/results";
import { ZodIssue } from "zod";

export class AppError<T extends Results<ResultBase> = Results<ResultBase>> extends Error implements IAppError<T> {
  public results: T | null = null;
  public details: IAppDetailedError[] = [];

  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly cause?: unknown,
  ) {
    super(message, { cause });
  }
}
export class NotFoundError extends AppError {
  constructor(details?: string, cause?: unknown) {
    super(ErrorCode.REQUEST_ERROR, details || "Not Found", cause);
  }
}

export class ForbiddenError extends AppError {
  constructor(details?: string, cause?: Error) {
    super(ErrorCode.FORBIDDEN_ERROR, details || "Forbidden", cause);
  }
}

export class InActiveProjectError extends ForbiddenError {
  constructor(readonly cause?: Error) {
    super("Project must be active to proceed.", cause);
  }
}

export class ActiveProjectError extends ForbiddenError {
  constructor(readonly cause?: Error) {
    super("Project must be 'Offer Letter Sent' to proceed.", cause);
  }
}

export class FormHandlerError extends AppError {
  constructor(
    public key: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dto: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public result: any,
    public cause: IAppError,
  ) {
    super(cause.code, cause.message || "Not Found", cause);
  }
}

export class ZodFormHandlerError extends AppError {
  constructor(
    public dto: AnyObject | null,
    message: string,
    public zodIssues: ZodIssue[],
    cause?: Error,
  ) {
    super(ErrorCode.VALIDATION_ERROR, message, cause);
  }
}

export class BadRequestError extends AppError {
  constructor(details?: string, cause?: Error) {
    super(ErrorCode.BAD_REQUEST_ERROR, details || "Invalid Request", cause);
  }
}

export class ValidationError<T extends Results<ResultBase> = Results<ResultBase>> extends AppError<T> {
  constructor(results: T, cause?: Error) {
    super(ErrorCode.VALIDATION_ERROR, "Validation Error", cause);
    this.results = results;
    this.details = mapValidationResultErrors(results);
  }
}

export class UnauthenticatedError extends AppError {
  constructor(cause?: unknown) {
    super(ErrorCode.UNAUTHENTICATED_ERROR, "User not authenticated", cause);
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, cause?: unknown) {
    super(ErrorCode.CONFIGURATION_ERROR, message, cause);
  }
}

export class SfdcServerError extends AppError {
  constructor(message: string, details: IAppDetailedError[], cause?: unknown) {
    super(ErrorCode.SFDC_ERROR, message, cause);
    this.details = details;
  }
}

/**
 * type guard narrows unknown to error if it matches Error api
 */
export function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}
