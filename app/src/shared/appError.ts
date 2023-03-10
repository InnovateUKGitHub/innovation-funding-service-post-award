import { ErrorCode, IAppError } from "@framework/types";
import { Results } from "@ui/validation/results";

export class AppError extends Error implements IAppError {
  public results: Results<{}> | null = null;

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

export class FormHandlerError extends AppError {
  constructor(
    public key: string,
    public store: any,
    public dto: any,
    public result: any, // TODO: fix this any issue
    public error: IAppError,
  ) {
    super(error.code, error.message || "Not Found");
  }
}

export class BadRequestError extends AppError {
  constructor(details?: string, readonly original?: Error) {
    super(ErrorCode.BAD_REQUEST_ERROR, details || "Invalid Request", original);
  }
}

export class ValidationError extends AppError {
  constructor(results: Results<{}>, readonly original?: Error) {
    super(ErrorCode.VALIDATION_ERROR, "Validation Error", original);
    this.results = results;
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

/**
 * type guard narrows unknown to error if it matches Error api
 */
export function isError(err: unknown): err is Error {
  return typeof err === "object" && err !== null && "message" in err;
}
