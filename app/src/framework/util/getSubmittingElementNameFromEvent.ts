import { SyntheticEvent } from "react";

/**
 * dives into the Synthetic Submit Event to get the element that initiated the submit action
 */
export function getSubmittingElementFromEvent(event: SyntheticEvent<HTMLButtonElement, SubmitEvent>) {
  return event?.nativeEvent?.submitter as HTMLButtonElement;
}

/**
 * returns true if the event was submitted by the element with the matching name
 * and value if provided
 *
 * @example
 * isSubmittedBy(event,"button_save-and-continue" ); // true
 * isSubmittedBy(event,"submitButton", "save-and-continue" ); // true
 */
export function isSubmittedBy(event: SyntheticEvent<HTMLButtonElement, SubmitEvent>, name: string, value = "") {
  const submitter = getSubmittingElementFromEvent(event);
  return value ? submitter?.name === name && submitter?.value === value : submitter?.name === name;
}
