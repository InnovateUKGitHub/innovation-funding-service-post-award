import { useEffect, useRef } from "react";
import { FieldValues, UseFormTrigger, UseFormWatch } from "react-hook-form";

/**
 * useFormRevalidate
 * -----------------
 *
 * handler to force validation on change events. Auto validation does not necessarily occur
 * with derived fields and needs to be triggered. This hook will force revalidation
 *
 * @param watch the React Hook Form watch method
 * @param trigger the React Hook Form trigger method
 * @param {boolean} [shouldInitiallyValidate] defaults to false, set to true if form should be force revalidated initially
 */
export function useFormRevalidate<T extends FieldValues>(
  watch: UseFormWatch<T>,
  trigger: UseFormTrigger<T>,
  shouldInitiallyValidate = false,
) {
  // ref prevents revalidating until after the submit event has been triggered once unless pcr marked as complete
  const hasSubmitted = useRef(shouldInitiallyValidate);

  const submitFormHandler = () => {
    hasSubmitted.current = true;
  };

  useEffect(() => {
    // sets the hasSubmitted to true on the event
    window.addEventListener("submit", submitFormHandler);

    const subscription = watch(() => {
      if (hasSubmitted.current) {
        trigger();
      }
    });

    return () => {
      window.removeEventListener("submit", submitFormHandler);
      subscription.unsubscribe();
    };
  }, [watch, trigger]);
}
