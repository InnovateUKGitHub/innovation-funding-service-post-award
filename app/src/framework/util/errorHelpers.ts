import { FieldErrors } from "react-hook-form";
import { useFormErrorContext } from "@ui/context/form-error";
import { IAppError } from "@framework/types/IAppError";
import { ZodError } from "zod";
import { useState } from "react";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";

/**
 * This converts from html error format as returned by react-hook-form, zod or yup, into the format used
 * by our error components. Hopefully we should be able to retire the need for this function in the future.
 *
 * It uses the key of the errors object to be used as the url link, with the assumption that the `name` and the `id` of the input
 * match
 */
export const convertHookFormErrorsToResultFormat = <TFormValues extends AnyObject>(
  errors: FieldErrors<TFormValues>,
) => {
  if (!errors) return [];
  const resultArray = Object.entries(errors).map(([key, value]) => {
    if (value && typeof value?.message === "string") {
      return new Result(null, true, false, value?.message ?? null, value?.type === "required", key);
    } else {
      return new Result(null, true, false, "This error type not supported yet", true);
    }
  });

  return resultArray;
};

/**
 * This converts from html error format as returned by react-hook-form, zod or yup, into the format used
 * by our error components. Hopefully we should be able to retire the need for this function in the future.
 *
 * It uses the key of the errors object to be used as the url link, with the assumption that the `name` and the `id` of the input
 * match
 */
export const convertResultErrorsToReactHookFormFormat = (errors: Result[] | null | undefined) => {
  if (!errors || !errors.length) return null;

  return errors.reduce((acc, cur) => ({ ...acc, [cur.key]: { message: cur.errorMessage } }), {});
};

/**
 * In some cases we wish to validate errors directly from zod without going through
 * react hook form, e.g. when validating directly on a dto.
 *
 * In this case the formats and responses are different.
 *
 *
 */
export const convertZodErrorsToResultsFormat = <TFormValues extends AnyObject>(errors: ZodError<TFormValues>) => {
  const resultArray = errors.issues.map(value => {
    if (value && typeof value?.message === "string") {
      return new Result(null, true, false, value?.message ?? null, true, String(value?.path?.[0]));
    } else {
      return new Result(null, true, false, "This error type not supported yet", true);
    }
  });

  return resultArray;
};

/**
 * `useValidationErrors` takes the react hook form  errors, converts to our Results format and merges
 * with any server side rendering errors before returning.
 *
 */
export const useValidationErrors = <TFormValues extends AnyObject>(errors: FieldErrors<TFormValues>) => {
  const validationErrors = convertHookFormErrorsToResultFormat<TFormValues>(errors);
  const serverSideFormErrors = useFormErrorContext();
  const combinedErrors = (validationErrors ?? []).concat(serverSideFormErrors ?? []);
  const errorResults = new Results({ model: {}, showValidationErrors: true, results: combinedErrors });
  return errorResults;
};

/**
 * `useRhfErrors` takes the results format from server side errors and formats and merges with rhf format. The inverse of the
 * `useValidationErrors` hook
 *
 */
export const useRhfErrors = <TFormValues extends AnyObject>(errors: FieldErrors<TFormValues>) => {
  const serverSideFormErrors = useFormErrorContext();
  return Object.assign({}, errors, convertResultErrorsToReactHookFormFormat(serverSideFormErrors));
};

/**
 * Sometimes validation will occur outside of a hook form, e.g. validating directly on a  partial dto.
 * If not using rhf, then the errors come in the Zod format, rather than the hook form format, and so
 * a separate handler is used for these cases.
 */
export const useZodFormatValidationErrors = (): [Results<{}>, (zodErrors: ZodError) => void] => {
  const serverFormErrors = useFormErrorContext();
  const [validatorErrors, setValidatorErrors] = useState(
    new Results({ model: {}, showValidationErrors: true, results: serverFormErrors }),
  );

  const setZodFormatErrors = (zodErrors: ZodError) => {
    const validationErrors = convertZodErrorsToResultsFormat(zodErrors);
    const combinedErrors = (validationErrors ?? []).concat(serverFormErrors ?? []);
    const errorResults = new Results({ model: {}, showValidationErrors: true, results: combinedErrors });
    setValidatorErrors(errorResults);
  };

  return [validatorErrors, setZodFormatErrors];
};

/**
 * type guard to help type unknown to IAppError
 */
export const isApiError = (err: unknown): err is IAppError => {
  return typeof err === "object" && err !== null && "code" in err && "message" in err;
};

type ValidationError = {
  key: string;
  message: string | null;
};

/**
 * converts from generated react hook form errors to an array of messages and keys for creating the error message and links in the Validation Summary
 */
export function convertErrorFormatFromRhfForErrorSummary(errors: RhfErrors) {
  const validationErrors: ValidationError[] = [];
  if (!errors) return validationErrors;

  Object.entries(errors).forEach(([key, value]) => {
    if (value && "message" in value) {
      const message = String(value.message);
      validationErrors.push({ key, message });
    } else if (Array.isArray(value)) {
      value.forEach((x, i) => {
        validationErrors.push({ key: `${key}_${i}`, message: x?.message ?? null });
      });
    }
  });

  return validationErrors;
}
