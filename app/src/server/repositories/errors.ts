
export class SalesforceUnavilableError extends Error { }

export class SalesforceInvalidFilterError extends Error { }

export class SalesforceDataChangeError extends Error {
  constructor(message: string, public errors: string[]) {
    super(message);
  }
}

export class SalesforceTokenError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}
