import { Results } from "../ui/validation/results";

export enum ErrorCode {
  UNKNOWN_ERROR = 1,
  SECURITY_ERROR = 2,
  VALIDATION_ERROR = 3,
  REQUEST_ERROR = 4,
  BAD_REQUEST_ERROR = 5,
  FORBIDDEN_ERROR = 6
}

export interface IAppError {
  code: ErrorCode;
  message: string;
  results: Results<{}> | null;
}
