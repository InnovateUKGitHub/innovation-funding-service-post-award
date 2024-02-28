import { ErrorCode } from "@framework/constants/enums";
import { IAppDetailedError, IAppError } from "@framework/types/IAppError";
import { mapValidationResultErrors } from "@shared/mapAppErrorDetails";
import { Results } from "@ui/validation/results";
import { ZodIssue } from "zod";

export class AppError<T extends Results<ResultBase> = Results<ResultBase>> extends Error implements IAppError<T> {
  public results: T | null = null;
  public details: IAppDetailedError[] = [];

  constructor(public code: ErrorCode, public message: string, public original?: Error) {
    super();
  }
}

export class NotFoundError extends AppError {
  constructor(details?: string, readonly original?: Error) {
    super(ErrorCode.REQUEST_ERROR, details || "Not Found", original);
  }
}

export class ForbiddenError extends AppError {
  constructor(details?: string, readonly original?: Error) {
    super(ErrorCode.FORBIDDEN_ERROR, details || "Forbidden", original);
  }
}

export class InActiveProjectError extends ForbiddenError {
  constructor(readonly original?: Error) {
    super("Project must be active to proceed.", original);
  }
}

export class ActiveProjectError extends ForbiddenError {
  constructor(readonly original?: Error) {
    super("Project must be 'Offet Letter Sent' to proceed.", original);
  }
}

export class FormHandlerError extends AppError {
  constructor(
    public key: string,
    public store: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public dto: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public result: any,
    public error: IAppError,
  ) {
    super(error.code, error.message || "Not Found");
  }
}

export class ZodFormHandlerError extends AppError {
  constructor(public dto: AnyObject | null, message: string, public zodIssues: ZodIssue[]) {
    super(ErrorCode.VALIDATION_ERROR, message);
  }
}

export class BadRequestError extends AppError {
  constructor(details?: string, readonly original?: Error) {
    super(ErrorCode.BAD_REQUEST_ERROR, details || "Invalid Request", original);
  }
}

export class ValidationError<T extends Results<ResultBase> = Results<ResultBase>> extends AppError<T> {
  constructor(results: T, readonly original?: Error) {
    super(ErrorCode.VALIDATION_ERROR, "Validation Error", original);
    this.results = results;
    this.details = mapValidationResultErrors(results);
  }
}

export class UnauthenticatedError extends AppError {
  constructor() {
    super(ErrorCode.UNAUTHENTICATED_ERROR, "User not authenticated");
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(ErrorCode.CONFIGURATION_ERROR, message);
  }
}

export class SfdcServerError extends AppError {
  constructor(message: string, details: IAppDetailedError[]) {
    super(ErrorCode.SFDC_ERROR, message);
    this.details = details;
  }
}

/**
 * type guard narrows unknown to error if it matches Error api
 */
export function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}
