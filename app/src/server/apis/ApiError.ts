import {ValidationError} from "../../shared/validation";

export enum ErrorCode {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500
}

export interface IApiError {
  errorCode: ErrorCode;
  message: string | ValidationError;
}

export class ApiError implements IApiError {
  constructor(public errorCode: ErrorCode, public message: string | ValidationError, public isApiError = true) {}
}
