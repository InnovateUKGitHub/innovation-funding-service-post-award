import { useRhfErrors } from "@framework/util/errorHelpers";
import { isEmpty, isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import { FieldErrors } from "react-hook-form";

/**
 * Hook returns a suite of hooks for handling errors on the migrated workflow pages
 */
export const usePcrItemWorkflowHooks = () => {
  /**
   * this state holds the pcr validation errors and also a setter for use in child components, enabling errors raised
   * in a step to be hoisted up to page level
   */
  const [pcrValidationErrors, setPcrValidationErrors] = useState<RhfErrors>(undefined);
  /**
   * keeps a reference of errors raised on a workflow summary page
   */
  const summaryErrors = useRef<RhfErrors>({});

  /**
   * this hook will allow a workflow component to set validation errors on the page
   *
   * the `isSummary` boolean must be true for any workflow summary page
   */
  const useSetPcrValidationErrors = <TFormValues extends AnyObject>(
    formStateErrors: FieldErrors<TFormValues>,
    isSummary?: boolean,
  ) => {
    /**
     * convert zod errors from to match the RhfError shape
     */
    const validationErrors = useRhfErrors(formStateErrors);
    const lastErrors = useRef<RhfErrors>({});

    /**
     * restrict the setStates to when the errors have changed in some way
     */
    const hasValidationErrorsChanged = !isEqual(lastErrors.current, validationErrors);

    useEffect(() => {
      /**
       * prevent prematurely overriding the error message brought in as part of the summary validation
       */
      if (!isEmpty(summaryErrors.current) && !isEmpty(validationErrors)) {
        setPcrValidationErrors(validationErrors);
        /*
         * otherwise update the errors
         */
      } else if (isEmpty(summaryErrors.current)) {
        setPcrValidationErrors(validationErrors);
      }

      /**
       * we set the summary errors ref if the `isSummary` boolean is true.
       * Therefore, important to pass in `true` as the second arg to useSetPcrValidationErrors from any
       * workflow summary page
       */
      if (isSummary) {
        summaryErrors.current = validationErrors;
      }

      /**
       * assign last errors to match current value
       */
      lastErrors.current = validationErrors;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasValidationErrorsChanged, setPcrValidationErrors, isSummary]);
  };

  /**
   * this hook will remove any errors not in the array of error fields from the page.
   */
  const useErrorSubset = (errorFields: string[]) => {
    useEffect(() => {
      setPcrValidationErrors(s => errorFields.reduce((acc, cur) => ({ ...acc, [cur]: s?.[cur] }), {}));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };

  /**
   * this hook will remove the indicated error
   */
  const useClearPcrValidationError = (errorField: string, shouldClear: boolean) => {
    useEffect(() => {
      if (shouldClear) {
        setPcrValidationErrors(s => ({ ...s, [errorField]: undefined }));
        if (summaryErrors.current && summaryErrors.current[errorField]) {
          summaryErrors.current = {};
        }
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorField, setPcrValidationErrors, shouldClear]);
  };

  /**
   * this hook combines the operations of useSetPcrValidationErrors, useErrorSubset and useClearPcrValidationError
   *
   * @example
   * usePcrErrors({
   *   errors: formState.errors,
   *   errorSubset: ["publicDescription"],
   *   clearErrors: {
   *     publicDescription: publicDescriptionLength > 0,
   *   },
   * });
   */
  const usePcrErrors = <TFormValues extends AnyObject>({
    errors,
    errorSubset,
    clearErrors,
    isSummary,
  }: {
    errors: FieldErrors<TFormValues>;
    errorSubset: string[];
    clearErrors: Record<string, boolean>;
    isSummary?: boolean;
  }) => {
    useSetPcrValidationErrors(errors, isSummary);
    useErrorSubset(errorSubset);

    const clearErrorEntries = Object.entries(clearErrors);
    const clearErrorValues = Object.values(clearErrors);

    useEffect(() => {
      clearErrorEntries.forEach(([errorField, shouldClear]) => {
        setPcrValidationErrors(s => (shouldClear ? { ...s, [errorField]: undefined } : s));
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, clearErrorValues);
  };

  return {
    pcrValidationErrors,
    setPcrValidationErrors,
    useClearPcrValidationError,
    useErrorSubset,
    usePcrErrors,
    useSetPcrValidationErrors,
  };
};
