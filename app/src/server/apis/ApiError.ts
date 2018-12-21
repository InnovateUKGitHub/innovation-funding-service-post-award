export enum StatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export interface IBadRequestError {
  message: string;
}

export class BadRequestError extends Error implements IBadRequestError {
  constructor(public message: string) {
    super();
  }
}
