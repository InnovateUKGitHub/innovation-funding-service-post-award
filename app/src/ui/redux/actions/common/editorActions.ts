import { Results } from "@ui/validation/results";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { ErrorCode, IAppError } from "@framework/types/IAppError";
import { createAction } from "./createAction";

export type UpdateEditorAction = ReturnType<typeof updateEditorAction>;
export type EditorSubmitAction = ReturnType<typeof handleEditorSubmit>;
export type EditorSuccessAction = ReturnType<typeof handleEditorSuccess>;
export type EditorErrorAction = ReturnType<typeof handleEditorError>;
export type EditorResetAction = ReturnType<typeof resetEditor>;

export type EditorAction = UpdateEditorAction | EditorSubmitAction | EditorSuccessAction | EditorErrorAction | EditorResetAction;

export function updateEditorAction<T>(id: string, store: string, dto: T, validator: Results<{}> | null) {
  const payload = {id, store, dto, validator};
  return createAction("EDITOR_UPDATE", payload);
}

export function handleEditorSubmit<T>(id: string, store: string, dto: T, validator: Results<{}> | null) {
  return createAction("EDITOR_SUBMIT", { id, store, dto, validator });
}

export function handleEditorSuccess(id: string, editorStore: string) {
  return createAction("EDITOR_SUBMIT_SUCCESS", {id, store: editorStore});
}

interface HandleEditorErrorParams<T> {
  id: string;
  store: string;
  dto: T;
  validation: Results<{}> | null;
  error: IAppError;
  scrollToTop?: boolean;
}

// @TODO - refactor to be multiple parameters
export function handleEditorError<T>({ id, store, dto, error, scrollToTop = true }: HandleEditorErrorParams<T>) {
  if (scrollToTop) scrollToTheTopSmoothly();
  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return updateEditorAction(id, store, dto, error.results!);
  }
  return createAction("EDITOR_SUBMIT_ERROR", { id, store, dto, error });
}

export function resetEditor(id: string, store: string) {
  return createAction("EDITOR_RESET", { id, store });
}
