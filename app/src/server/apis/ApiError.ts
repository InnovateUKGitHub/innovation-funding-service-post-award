export enum StatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export interface IApiError {
  errorCode: StatusCode;
  message: string;
}

export class ApiError extends Error implements IApiError {
  constructor(public errorCode: StatusCode, public message: string) {
    super();
  }
}
