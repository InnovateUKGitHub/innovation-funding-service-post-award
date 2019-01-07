import { ErrorCode, IAppError } from "../../../types/IAppError";
import { Results } from "../../../ui/validation/results";

export class AppError extends Error implements IAppError {
  public results: Results<{}> | null = null;

  constructor(public code: ErrorCode, public message: string, public original?: Error) {
    super();
  }
}

export class NotFoundError extends AppError {
  constructor(
    details?: string,
    readonly original?: Error
  ) {
    super(ErrorCode.REQUEST_ERROR, details || "Not Found", original);
  }
}

export class BadRequestError extends AppError {
  constructor(
    details?: string,
    readonly original?: Error
  ) {
    super(ErrorCode.BAD_REQUEST_ERROR, details || "Invalid Request", original);
  }
}

export class ValidationError extends AppError {
  constructor(
    results: Results<{}>,
    readonly original?: Error
  ) {
    super(ErrorCode.VALIDATION_ERROR, "Validation Error", original);
    this.results = results;
  }
}
