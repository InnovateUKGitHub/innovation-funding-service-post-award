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
  constructor(message: string, public errors: string[]) {
    super(message);
  }
}

export class SalesforceTokenError extends Error {
  constructor(public tokenError: unknown) {
    super("AUTHENTICATION_ERROR");
  }
}
