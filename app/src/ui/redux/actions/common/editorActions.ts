import {createAction} from "./createAction";
import {Results} from "../../../validation/results";
import {ErrorCode} from "../../../../server/apis/ApiError";
import { scrollToTheTop } from "../../../../util/windowHelpers";

type UpdateEditorThunk = typeof updateEditorAction;
type ResetEditorThunk = typeof resetEditorAction;
type ResetEditorsThunk = typeof resetAllEditorsAction;
export type UpdateEditorAction = ReturnType<UpdateEditorThunk>;
export type ResetEditorAction = ReturnType<ResetEditorThunk>;
export type ResetEditorsAction = ReturnType<ResetEditorsThunk>;

export function updateEditorAction<T>(
  id: string,
  store: string,
  dto: T,
  validator: Results<T> | null,
  error?: IAppError | null
) {
  const payload = {id, store, dto, validator, error};
  return createAction("VALIDATE", payload);
}

export function resetEditorAction<T>(
  id: string,
  store: string,
) {
  return createAction("RESET_EDITOR", {id, store});
}

export function resetAllEditorsAction<T>(
  store: string,
) {
  return createAction("RESET_ALL_EDITORS", {store});
}

export function handleError<T>({id, store, dto, validation, error}: {
  id: string,
  store: string,
  dto: T,
  validation: Results<T> | null,
  error: any
}) {
  scrollToTheTop();
  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return updateEditorAction(id, store, dto, error.details, null);
  }
  return updateEditorAction(id, store, dto, validation, error);
}
