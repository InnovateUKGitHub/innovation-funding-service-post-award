import { ErrorPayload } from "@shared/create-error-payload";
import { RootActions } from "../actions/root";

export const errorReducer = (state: ErrorPayload["params"] | null = null, action: RootActions) => {
  if (action.type === "SET_ERROR") {
    return action.payload ?? null;
  }

  if (action.type === "REMOVE_ERROR") {
    return null;
  }

  return state;
};
