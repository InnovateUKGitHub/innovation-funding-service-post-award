import { FieldErrors } from "react-hook-form";
import { useFormErrorContext } from "@ui/context/form-error";
import { IAppError } from "@framework/types/IAppError";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";

/**
 * This converts from html error format as returned by react-hook-form, zod or yup, into the format used
 * by our error components. Hopefully we should be able to retire the need for this function in the future.
 *
 * It uses the key of the errors object to be used as the url link, with the assumption that the `name` and the `id` of the input
 * match
 */
export const convertErrorsToResultFormat = <TFormValues extends AnyObject>(errors: FieldErrors<TFormValues>) => {
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
 * `useValidationErrors takes the react hook form / zod errors, converts to our Results format and merges
 * with any server side rendering errors before returning.
 *
 */
export const useValidationErrors = <TFormValues extends AnyObject>(errors: FieldErrors<TFormValues>) => {
  const validationErrors = convertErrorsToResultFormat<TFormValues>(errors);
  const serverSideFormErrors = useFormErrorContext();
  const combinedErrors = (validationErrors ?? []).concat(serverSideFormErrors ?? []);
  const errorResults = new Results({ model: {}, showValidationErrors: true, results: combinedErrors });
  return errorResults;
};

/**
 * type guard to help type unknown to IAppError
 */
export const isApiError = (err: unknown): err is IAppError => {
  return typeof err === "object" && err !== null && "code" in err && "message" in err;
};
