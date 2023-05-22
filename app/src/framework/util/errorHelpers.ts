import { FieldErrors } from "react-hook-form";
import { Result, Results } from "@ui/validation";
import { useFormErrorContext } from "@ui/context/form-error";

/**
 * This converts from html error format as returned by react-hook-form, zod or yup, into the format used
 * by our error components. Hopefully we should be able to retire the need for this function in the future.
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
