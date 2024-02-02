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

export class SalesforceDataChangeError extends Error {
  constructor(message: string, public errors: SfdcError[]) {
    super(message);
  }
}

export class SalesforceTokenError extends Error {
  constructor(public tokenError: unknown) {
    super("AUTHENTICATION_ERROR");
  }
}

export class SalesforceErrorResponse extends Error {
  constructor(public errorCode: string) {
    super();
  }
}

export const isSalesforceTokenError = (err: unknown): err is SalesforceTokenError =>
  typeof err === "object" && err !== null && "message" in err && "tokenError" in err;

export const isSalesforceErrorResponse = (err: unknown): err is SalesforceErrorResponse =>
  typeof err === "object" && err !== null && "message" in err && "errorCode" in err;
