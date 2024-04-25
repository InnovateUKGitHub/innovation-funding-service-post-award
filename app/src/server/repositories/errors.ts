import { DetailedErrorCode } from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { mapSfdcErrors, mapSfdcFieldCustomValidation } from "@shared/mapAppErrorDetails";
import { Error as SfdcError } from "jsforce";

export class BadSalesforceQuery extends Error {
  constructor(public errorReason: string = "FAILED_SOQL_QUERY", public errorDetail?: unknown) {
    super(errorReason);
  }
}

export class SalesforceUnavailableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class FileTypeNotAllowedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SalesforceInvalidFilterError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class SalesforceTokenError extends Error {
  constructor(public tokenError: unknown) {
    super("AUTHENTICATION_ERROR");
  }
}

export class SalesforceDetailedErrorResponse extends Error {
  public readonly errorCode?: string;
  public readonly details: IAppDetailedError[];
  constructor({ errorCode, message, details }: { errorCode?: string; message: string; details: IAppDetailedError[] }) {
    super(message);
    this.errorCode = errorCode;
    this.details = details;
  }
}

export class SalesforceFieldCustomValidationError extends SalesforceDetailedErrorResponse {
  constructor({ message }: { message: string }) {
    super({
      errorCode: "FIELD_CUSTOM_VALIDATION_EXCEPTION",
      message: `FIELD_CUSTOM_VALIDATION_EXCEPTION: ${message}`,
      details: [
        {
          code: DetailedErrorCode.SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION,
          message: mapSfdcFieldCustomValidation(message),
        },
      ],
    });
  }
}

export class SalesforceDataChangeError extends SalesforceDetailedErrorResponse {
  constructor(message: string, errors: (SfdcError | IAppDetailedError)[]) {
    super({ message, details: mapSfdcErrors(errors) });
  }
}

export const isSalesforceTokenError = (err: unknown): err is SalesforceTokenError =>
  typeof err === "object" && err !== null && "message" in err && "tokenError" in err;

export const isSalesforceErrorResponse = (err: unknown): err is SalesforceDetailedErrorResponse =>
  typeof err === "object" && err !== null && "message" in err && "errorCode" in err;
