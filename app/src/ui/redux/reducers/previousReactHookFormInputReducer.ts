import { RootActions } from "../actions/root";

export const previousReactHookFormInputReducer = (state: AnyObject | undefined | null, action: RootActions) => {
  if (action.type === "SET_PREVIOUS_REACT_HOOK_FORM_INPUT") {
    if (action.payload) {
      // DO NOT RETURN BANK DETAILS TO THE WEB BROWSER
      delete action.payload.sortCode;
      delete action.payload.accountNumber;
    }

    return action.payload ?? null;
  }

  if (action.type === "REMOVE_PREVIOUS_REACT_HOOK_FORM_INPUT") {
    return null;
  }

  return state ?? null;
};
