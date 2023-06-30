import { ZodIssue } from "zod";
import { createAction } from "./createAction";

export type ZodErrorActions = SetZodError | RemoveZodError;

type SetZodError = ReturnType<typeof setZodError>;
export const setZodError = (error: ZodIssue[]) => createAction("SET_ZOD_ERROR", error);

type RemoveZodError = ReturnType<typeof removeZodError>;
export const removeZodError = () => createAction("REMOVE_ZOD_ERROR");
