import { ZodIssue } from "zod";
import { RootActions } from "../actions/root";

export const zodErrorReducer = (state: ZodIssue[] = [], action: RootActions) => {
  if (action.type === "SET_ZOD_ERROR") {
    return action.payload ?? [];
  }

  if (action.type === "REMOVE_ZOD_ERROR") {
    return [];
  }

  return state;
};
