import { FieldErrors } from "react-hook-form";
import { useFormErrorContext } from "@ui/context/form-error";
import { IAppError } from "@framework/types/IAppError";
import { ZodError } from "zod";
import { useState } from "react";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { NestedResult } from "@ui/validation/nestedResult";

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

const isNestedResult = (
  error: Result | NestedResult<Results<ResultBase>>,
): error is NestedResult<Results<ResultBase>> =>
  "results" in error && Array.isArray(error?.results) && error.results.length > 0;

/**
 * This converts from html error format as returned by react-hook-form, zod or yup, into the format used
 * by our error components. Hopefully we should be able to retire the need for this function in the future.
 *
 * It uses the key of the errors object to be used as the url link, with the assumption that the `name` and the `id` of the input
 * match
 */
export const convertResultErrorsToReactHookFormFormat = (errors: Result[] | null | undefined): RhfErrors => {
  if (!errors || !errors.length) return null;

  return errors.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.key]: isNestedResult(cur)
        ? cur.results.map(nestedResult => convertResultErrorsToReactHookFormFormat(nestedResult?.errors ?? []))
        : { message: cur.errorMessage },
    }),
    {},
  );
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

  return Object.assign({}, errors, convertResultErrorsToReactHookFormFormat(serverSideFormErrors)) as RhfErrors;
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
export function convertErrorFormatFromRhfForErrorSummary(
  errors: RhfErrors | RhfError,
  path = "",
  validationErrors: ValidationError[] = [],
) {
  if (!errors) return validationErrors;

  if (typeof errors === "object" && "message" in errors) {
    const message = String(errors.message);
    const key = path;
    validationErrors.push({ key, message });
    return validationErrors;
  } else if (Array.isArray(errors)) {
    errors.forEach((e, i) => {
      if (e === null) {
        validationErrors.push({ key: path ? `${path}_${i}` : `${i}`, message: null });
      }
      convertErrorFormatFromRhfForErrorSummary(e, path ? `${path}_${i}` : `${i}`, validationErrors);
    });
  } else {
    Object.entries(errors).forEach(([key, value]) =>
      convertErrorFormatFromRhfForErrorSummary(value as RhfError, path ? `${path}_${key}` : key, validationErrors),
    );
  }

  return validationErrors;
}
