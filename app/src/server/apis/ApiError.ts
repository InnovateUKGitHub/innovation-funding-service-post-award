import {Results} from "../../ui/validation/results";

export enum StatusCode {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500
}

export enum ErrorCode {
  SERVER_ERROR = 1,
  VALIDATION_ERROR = 3,
}

export interface IApiError {
  errorCode: StatusCode;
  message: string | Results<{}>;
}

export class ApiError implements IApiError {
  constructor(public errorCode: StatusCode, public message: string | Results<{}>) {}
}
