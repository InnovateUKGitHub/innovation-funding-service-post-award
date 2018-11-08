export enum StatusCode {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

export enum ErrorCode {
  SERVER_ERROR = 1,
  SECURITY_ERROR = 2,
  VALIDATION_ERROR = 3,
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
