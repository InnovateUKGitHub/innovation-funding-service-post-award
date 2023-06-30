import { createAction } from "./createAction";

export type PreviousReactHookFormActions = SetPreviousReactHookFormInput | RemovePreviousReactHookFormInput;

type SetPreviousReactHookFormInput = ReturnType<typeof setPreviousReactHookFormInput>;
export const setPreviousReactHookFormInput = (error: AnyObject) =>
  createAction("SET_PREVIOUS_REACT_HOOK_FORM_INPUT", error);

type RemovePreviousReactHookFormInput = ReturnType<typeof removePreviousReactHookFormInput>;
export const removePreviousReactHookFormInput = () => createAction("REMOVE_PREVIOUS_REACT_HOOK_FORM_INPUT");
