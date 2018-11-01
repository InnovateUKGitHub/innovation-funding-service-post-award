import {createAction} from "./createAction";
import {Results} from "../../../validation/results";
import {ErrorCode} from "../../../../server/apis/ApiError";

type UpdateEditorThunk = typeof updateEditorAction;
export type UpdateEditorAction = ReturnType<UpdateEditorThunk>;

export function updateEditorAction<T>(
  id: string,
  store: string,
  dto: T,
  validator: Results<T> | null,
  error?: any
) {
  const payload = {id, store, dto, validator, error};
  return createAction("VALIDATE", payload);
}

export function handleError<T>({id, store, dto, validation, error}: {
  id: string,
  store: string,
  dto: T,
  validation: Results<T> | null,
  error: any
}) {
  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return updateEditorAction(id, store, dto, error.details, error);
  }
  return updateEditorAction(id, store, dto, validation, error);
}
