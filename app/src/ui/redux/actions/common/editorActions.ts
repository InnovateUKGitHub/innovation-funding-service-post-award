import {createAction} from "./createAction";
import {Results} from "../../../validation/results";
import { scrollToTheTop } from "../../../../util/windowHelpers";
import { ErrorCode } from "../../../../types/IAppError";

type UpdateEditorThunk = typeof updateEditorAction;
type HandleSuccessThunk = typeof handleEditorSuccess;
type HandleErrorThunk = typeof handleEditorError;
export type UpdateEditorAction = ReturnType<UpdateEditorThunk>;
export type HandleSuccessAction = ReturnType<HandleSuccessThunk>;
export type HandleErrorAction = ReturnType<HandleErrorThunk>;

export type EditorAction = UpdateEditorAction | HandleSuccessAction | HandleErrorAction;

export function updateEditorAction<T>(
  id: string,
  store: string,
  dto: T,
  validator: Results<T> | null
) {
  const payload = {id, store, dto, validator};
  return createAction("UPDATE_EDITOR", payload);
}

export function handleEditorSuccess<T>(
  id: string,
  editorStore: string,
) {
  return createAction("EDITOR_SUBMIT_SUCCESS", {id, store: editorStore});
}

export function handleEditorError<T>({id, store, dto, validation, error}: {
  id: string,
  store: string,
  dto: T,
  validation: Results<T> | null,
  error: any
}) {
  scrollToTheTop();
  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return updateEditorAction(id, store, dto, error.details);
  }
  return createAction("EDITOR_SUBMIT_ERROR", { id, store, dto, error });
}
