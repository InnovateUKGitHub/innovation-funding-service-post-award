import {
  DetailedErrorCode,
  SalesforceStatusCode,
  SfdcFieldCustomValidationException,
} from "@framework/constants/enums";
import { IAppDetailedError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { Error as SfdcError } from "jsforce";

/**
 * Map SFDC errors to ACC error details
 * @param errors List of SFDC errors
 * @returns List of ACC errors
 */
export const mapSfdcErrors = (errors: SfdcError[]): IAppDetailedError[] => {
  const details: IAppDetailedError[] = [];

  for (const error of errors) {
    switch (error.statusCode) {
      case SalesforceStatusCode.INVALID_CROSS_REFERENCE_KEY:
        if (error.fields.includes("RecordTypeId"))
          details.push({
            code: DetailedErrorCode.SFDC_CANNOT_USE_RECORD_TYPE,
            message: error.message,
          });
        break;
      case SalesforceStatusCode.STRING_TOO_LONG:
        const match = /max length=(\d+)/.exec(error.message);
        const maximum = match?.[1];

        details.push({
          code: DetailedErrorCode.SFDC_STRING_TOO_LONG,
          field: error.fields?.[0],
          maximum: maximum ? parseInt(maximum, 10) : undefined,
        });
        break;

      case SalesforceStatusCode.SF_UPDATE_ALL_FAILURE:
        details.push({
          code: DetailedErrorCode.SFDC_SF_UPDATE_ALL_FAILURE,
        });
        break;

      case SalesforceStatusCode.INSUFFICIENT_ACCESS_OR_READONLY:
        details.push({
          code: DetailedErrorCode.SFDC_INSUFFICIENT_ACCESS_OR_READONLY,
        });
        break;

      case SalesforceStatusCode.NOT_UPLOADED_FROM_OWNER:
        details.push({
          code: DetailedErrorCode.SFDC_NOT_UPLOADED_FROM_OWNER,
        });
        break;

      default:
        details.push({
          code: DetailedErrorCode.SFDC_DEFAULT_STACKTRACE,
          data: error,
        });
        break;
    }
  }

  return details;
};

export const mapValidationResultErrors = (results: Results<ResultBase>): IAppDetailedError[] => {
  const details: IAppDetailedError[] = [];

  if (Array.isArray(results.errors)) {
    for (const error of results.errors) {
      if (error.errorMessage) {
        details.push({
          code: DetailedErrorCode.ACC_VALIDATION_ERROR,
          message: error.errorMessage,
          key: error.keyId ?? undefined,
        });
      }
    }
  }

  return details;
};

export const mapSfdcFieldCustomValidation = (message: string): SfdcFieldCustomValidationException => {
  switch (message) {
    case "You need to set the Award Rate for this Participant before this claim can be processed.":
      return SfdcFieldCustomValidationException.CLAIM_MISSING_AWARD_RATE;
    default:
      return SfdcFieldCustomValidationException.UNKNOWN_ERROR;
  }
};
