import {ValidationError} from "../../shared/validation";
import {Results} from "../../ui/validation/results";

export enum ErrorCode {
  BAD_REQUEST = 400,
  INTERNAL_SERVER_ERROR = 500
}

export interface IApiError {
  errorCode: ErrorCode;
  message: string | Results<{}>;
}

export class ApiError implements IApiError {
  constructor(public errorCode: ErrorCode, public message: string | Results<{}>) {}
}
