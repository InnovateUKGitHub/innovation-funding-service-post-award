import { convertZodIssueToRhf } from "@framework/util/errorHelpers";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { useServerInputContext } from "@ui/context/server-input";
import { useServerZodError } from "@ui/context/server-zod-error";
import { FieldErrors, FieldValues, UseFormSetError } from "react-hook-form";
import { ZodIssue } from "zod";

/**
 * Convert Zod errors from the server into RHF compatible errors,
 * and keep RHF errors from the client as-is.
 *
 * @param setError React Hook Form "setError" method, to tell RHF of errors that have occured
 * @param formErrors React Hook Form clientside errors
 * @returns Serverside errors converted to RHF errors, or clientside errors as-is
 */
const useZodErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  formErrors: FieldErrors<T>,
  extraZodErrors?: ZodIssue[],
): RhfErrors => {
  const { isServer } = useMounted();
  const errors = useServerZodError();
  if (isServer) {
    const collatedErrors: RhfErrors = {};
    convertZodIssueToRhf(errors, collatedErrors, setError);
    convertZodIssueToRhf(extraZodErrors, collatedErrors, setError);
    return collatedErrors;
  } else {
    return formErrors as RhfErrors;
  }
};

/**
 * Obtain the input values of the previous form, such that it can be re-injected
 * and re-fill the user's input, in case of, e.g. invalid input / server side error.
 *
 * @returns The contents of the previous form that was submitted
 */
const useServerInput = <T extends FieldValues>() => {
  const previousInput = useServerInputContext();
  return previousInput as T | null;
};

export { useZodErrors, useServerInput };
