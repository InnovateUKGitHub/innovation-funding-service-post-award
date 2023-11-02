import { useEffect, useRef } from "react";
import { UseFormTrigger } from "react-hook-form";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { noop } from "lodash";

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

  const useFormValidate = <TFormValues extends AnyObject>(trigger: UseFormTrigger<TFormValues>) => {
    const { markedAsCompleteHasBeenChecked } = usePcrWorkflowContext();

    // ref prevents revalidating until after the submit event has been triggered once unless pcr marked as complete
    const hasSubmitted = useRef(markedAsCompleteHasBeenChecked);

    const submitFormHandler = () => (hasSubmitted.current = true);
    const changeFormHandler = () => (hasSubmitted.current ? trigger() : noop());

    useEffect(() => {
      if (markedAsCompleteHasBeenChecked) {
        // we need to revalidate the form immediately if marked as complete
        // trigger validation
        trigger();
      }

      // sets the hasSubmitted to true on the event
      window.addEventListener("submit", submitFormHandler);
      // triggers reevaluation on keypress
      window.addEventListener("change", changeFormHandler);
      // cleans up event listeners on unmount
      return () => {
        window.removeEventListener("submit", submitFormHandler);
        window.removeEventListener("change", changeFormHandler);
      };
    }, [trigger, markedAsCompleteHasBeenChecked]);
  };
  return {
    useFormValidate,
    useInitialValidate,
  };
};
