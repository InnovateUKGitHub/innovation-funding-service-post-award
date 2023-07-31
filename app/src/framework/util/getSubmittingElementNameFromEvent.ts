import { SyntheticEvent } from "react";

/**
 * dives into the Synthetic Submit Event to get the name of the element that initiated the submit action
 */
export function getSubmittingElementNameFromEvent(event: SyntheticEvent<HTMLButtonElement, SubmitEvent>) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore  -- inexplicably "name" is declared as not existing on type HTMLElement
  return (event?.nativeEvent?.submitter?.name ?? "no_submitting_element_found_in_event") as string;
}

/**
 * returns true if the event was submitted by the element with the matching name
 *
 * @example
 * isSubmittedBy("button_save-and-continue", event); // true
 */
export function isSubmittedBy(name: string, event: SyntheticEvent<HTMLButtonElement, SubmitEvent>) {
  return getSubmittingElementNameFromEvent(event) === name;
}
