import { useEffect } from "react";
import { UseFormTrigger } from "react-hook-form";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";

/**
 * Hook returns a suite of hooks for handling errors on the migrated workflow pages
 */
export const usePcrItemWorkflowHooks = () => {
  /**
   * Hook enables initial validation if marked_as_complete has been checked
   * @param trigger react hook form trigger function
   */
  const useInitialValidate = <TFormValues extends AnyObject>(trigger: UseFormTrigger<TFormValues>) => {
    const { markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();
    useEffect(() => {
      if (markedAsCompleteHasBeenChecked) {
        // trigger validation
        trigger();
      }
    }, [trigger, markedAsCompleteHasBeenChecked]);
  };

  return {
    useFormValidate: useFormRevalidate,
    useInitialValidate,
  };
};
