import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { RootState } from "@ui/redux/reducers/rootReducer";
import { FieldErrors, FieldValues, Path, UseFormSetError } from "react-hook-form";
import { useStore } from "react-redux";
import { ZodIssue } from "zod";

/**
 * Convert Zod errors from the server into RHF compatible errors,
 * and keep RHF errors from the client as-is.
 *
 * @param setError React Hook Form "setError" method, to tell RHF of errors that have occured
 * @param formErrors React Hook Form clientside errors
 * @returns Serverside errors converted to RHF errors, or clientside errors as-is
 */
const useZodErrors = <T extends FieldValues>(setError: UseFormSetError<T>, formErrors: FieldErrors): RhfErrors => {
  const store = useStore<RootState>();
  const { isServer } = useMounted();

  if (isServer) {
    const errors = store.getState().zodError as ZodIssue[] | undefined;

    if (errors) {
      const collatedErrors: RhfErrors = {};

      for (const error of errors) {
        const rhfError = { message: error.message, type: error.code };
        setError(error.path.join(".") as Path<T>, rhfError);
        collatedErrors[error.path.join(".")] = rhfError;
      }

      return collatedErrors;
    }

    return {};
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
  const store = useStore<RootState>();
  const previousInput = store.getState().previousReactHookFormInput as T | null;

  return previousInput;
};

export { useZodErrors, useServerInput };
