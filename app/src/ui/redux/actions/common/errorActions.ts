import { ErrorPayload } from "@shared/create-error-payload";
import { createAction } from "./createAction";

export type ErrorActions = SetError | RemoveError;

type SetError = ReturnType<typeof setError>;
export const setError = (error: ErrorPayload["params"]) => createAction("SET_ERROR", error);

type RemoveError = ReturnType<typeof removeError>;
export const removeError = () => createAction("REMOVE_ERROR");
