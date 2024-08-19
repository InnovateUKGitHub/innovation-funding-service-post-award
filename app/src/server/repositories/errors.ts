import { DetailedErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { TsforceSalesforceError } from "@server/tsforce/types/RenameMePlease";
import { mapSfdcErrors, mapSfdcFieldCustomValidation } from "@shared/mapAppErrorDetails";

export class BadSalesforceQuery extends Error {
  public errorReason: string;
  public errorDetail?: unknown;

  constructor({
    errorReason = "FAILED_SOQL_QUERY",
    errorDetail,
    cause,
  }: {
    errorReason?: string;
    errorDetail?: unknown;
    cause?: unknown;
  } = {}) {
    super(errorReason, { cause });
    this.errorReason = errorReason;
    this.errorDetail = errorDetail;
  }
}

export class SalesforceUnavailableError extends Error {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message, { cause });
  }
}

export class FileTypeNotAllowedError extends Error {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message, { cause });
  }
}

export class SalesforceInvalidFilterError extends Error {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message, { cause });
  }
}

export class SalesforceTokenError extends Error {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message, { cause });
  }
}

export class SalesforceDetailedErrorResponse extends Error {
  public readonly errorCode?: string;
  public readonly details: IAppDetailedError[];
  constructor({
    errorCode,
    message,
    details,
    cause,
  }: {
    errorCode?: string;
    message: string;
    details: IAppDetailedError[];
    cause?: unknown;
  }) {
    super(message, { cause });
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class SalesforceFieldCustomValidationError extends SalesforceDetailedErrorResponse {
  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super({
      errorCode: "FIELD_CUSTOM_VALIDATION_EXCEPTION",
      message: `FIELD_CUSTOM_VALIDATION_EXCEPTION: ${message}`,
      details: [
        {
          code: DetailedErrorCode.SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION,
          message: mapSfdcFieldCustomValidation(message),
        },
      ],
      cause,
    });
  }
}

export class SalesforceDataChangeError extends SalesforceDetailedErrorResponse {
  constructor(message: string, errors: (TsforceSalesforceError | IAppDetailedError)[]) {
    super({ message, details: mapSfdcErrors(errors) });
  }
}

export const isSalesforceTokenError = (err: unknown): err is SalesforceTokenError =>
  typeof err === "object" && err !== null && "message" in err && "tokenError" in err;

export const isSalesforceErrorResponse = (err: unknown): err is SalesforceDetailedErrorResponse =>
  typeof err === "object" && err !== null && "message" in err && "errorCode" in err;
