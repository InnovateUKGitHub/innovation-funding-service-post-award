export enum ErrorCode {
  BAD_REQUEST = 400
}

export interface IApiError {
  errorCode: ErrorCode;
  message: string;
}

export class ApiError implements IApiError {
  constructor(public errorCode: number, public message: string) {}
}
