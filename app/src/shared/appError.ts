import { ErrorCode } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { ZodError } from "zod";

export class AppError<T extends Results<ResultBase> = Results<ResultBase>> extends Error implements IAppError<T> {
  public results: T | null = null;

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
  constructor(public dto: AnyObject | null, public zodError: ZodError) {
    super(ErrorCode.VALIDATION_ERROR, zodError.message, zodError);
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
