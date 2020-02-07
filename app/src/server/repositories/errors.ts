
export class SalesforceUnavilableError extends Error {
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
  constructor(message: string, public status: number) {
    super(message);
  }
}
