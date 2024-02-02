import { DetailedErrorCode, ErrorCode } from "@framework/constants/enums";
import { Results } from "@ui/validation/results";
import type { Error as SfdcError } from "jsforce";

export interface IAppError<T extends Results<ResultBase> = Results<ResultBase>> {
  code: ErrorCode;
  message: string;
  results?: T | null;
  stack?: string;
  details: IAppDetailedError[];
}

interface IAppDetailedBaseError {
  code: DetailedErrorCode;
}

interface IAppDetailedAccValidationError extends IAppDetailedBaseError {
  code: DetailedErrorCode.ACC_VALIDATION_ERROR;
  message: string;
  key?: string;
}

interface IAppDetailedSfdcCannotUseRecordType extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_CANNOT_USE_RECORD_TYPE;
  message: string;
}

interface IAppDetailedSfdcStringTooLongError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_STRING_TOO_LONG;
  field: string;
  maximum: number | undefined;
}

interface IAppDetailedSfdcSfUpdateAllFailureError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_SF_UPDATE_ALL_FAILURE;
}

interface IAppDetailedSfdcInsufficientAccessOrReadonlyError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_INSUFFICIENT_ACCESS_OR_READONLY;
}

interface IAppDetailedSfdcNotUploadedFromOwnerError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_NOT_UPLOADED_FROM_OWNER;
}

interface IAppDetailedSfdcGenericError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_DEFAULT_STACKTRACE;
  data: SfdcError;
}

export type IAppDetailedError =
  | IAppDetailedAccValidationError
  | IAppDetailedSfdcCannotUseRecordType
  | IAppDetailedSfdcStringTooLongError
  | IAppDetailedSfdcSfUpdateAllFailureError
  | IAppDetailedSfdcInsufficientAccessOrReadonlyError
  | IAppDetailedSfdcNotUploadedFromOwnerError
  | IAppDetailedSfdcGenericError;
