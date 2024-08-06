import { DetailedErrorCode, ErrorCode, SfdcFieldCustomValidationException } from "@framework/constants/enums";
import { TsforceSalesforceError } from "@server/tsforce/types/TsforceSalesforceError";
import { Results } from "@ui/validation/results";
import { QueryPayload } from "react-relay-network-modern";

export interface IAppError<T extends Results<ResultBase> = Results<ResultBase>> {
  code: ErrorCode;
  message: string;
  results?: T | null;
  stack?: string;
  details: IAppDetailedError[];
  cause?: unknown | null;
}

export interface GraphqlError {
  name: string;
  message: string;
  stack?: string;
}

export const isGraphqlError = (er: unknown): er is GraphqlError =>
  typeof er === "object" && er !== null && "name" in er && "message" in er;

interface IAppDetailedBaseError {
  code: DetailedErrorCode;
}

interface IAppDetailedAccValidationError extends IAppDetailedBaseError {
  code: DetailedErrorCode.ACC_VALIDATION_ERROR;
  message: string;
  key?: string;
}

interface IAppDetailedAccGraphQLError extends IAppDetailedBaseError {
  code: DetailedErrorCode.ACC_GRAPHQL_ERROR;
  data: [string, QueryPayload][];
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
  id?: string;
}

interface IAppDetailedSfdcNotUploadedFromOwnerError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_NOT_UPLOADED_FROM_OWNER;
}

interface IAppDetailedSfdcFieldCustomValidationExceptionError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_FIELD_CUSTOM_VALIDATION_EXCEPTION;
  message: SfdcFieldCustomValidationException;
}

interface IAppDetailedSfdcGenericError extends IAppDetailedBaseError {
  code: DetailedErrorCode.SFDC_DEFAULT_STACKTRACE;
  data: TsforceSalesforceError;
}

export type IAppDetailedError =
  | IAppDetailedAccValidationError
  | IAppDetailedAccGraphQLError
  | IAppDetailedSfdcCannotUseRecordType
  | IAppDetailedSfdcStringTooLongError
  | IAppDetailedSfdcSfUpdateAllFailureError
  | IAppDetailedSfdcInsufficientAccessOrReadonlyError
  | IAppDetailedSfdcNotUploadedFromOwnerError
  | IAppDetailedSfdcGenericError
  | IAppDetailedSfdcFieldCustomValidationExceptionError;
