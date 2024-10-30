import { useEffect, useRef } from "react";
import { FieldValues, UseFormTrigger, UseFormWatch } from "react-hook-form";

/**
 * useFormRevalidate
 * -----------------
 *
 * handler to force validation on change events. Auto validation does not necessarily occur
 * with derived fields and needs to be triggered. This hook will force revalidation.
 *
 * The hook also returns a function that can be called to reset the initial validation state
 * to false. This can be useful in some workflows where a single form is used in multiple steps
 *
 * @param watch the React Hook Form watch method
 * @param trigger the React Hook Form trigger method
 * @param {boolean} [shouldInitiallyValidate] defaults to false, set to true if form should be force revalidated initially
 * @returns {{resetState: () => void}} a function to reset the initialState to false
 */
export function useFormRevalidate<T extends FieldValues>(
  watch: UseFormWatch<T>,
  trigger: UseFormTrigger<T>,
  shouldInitiallyValidate = false,
) {
  // ref prevents revalidating until after the submit event has been triggered once unless pcr marked as complete
  const hasSubmitted = useRef(shouldInitiallyValidate);

  // fires on initialization if should initially validate is true
  const hasFiredOnce = useRef(false);
  const submitFormHandler = () => {
    hasSubmitted.current = true;
  };

  if (shouldInitiallyValidate && !hasFiredOnce.current) {
    trigger();
    hasFiredOnce.current = true;
  }

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
  return {
    resetState: () => {
      hasSubmitted.current = false;
    },
  };
}
