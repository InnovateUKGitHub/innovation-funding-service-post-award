import { Results } from "@ui/validation/results";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { IAppError } from "@framework/types/IAppError";
import { createAction } from "./createAction";
import { ErrorCode } from "@framework/constants/enums";

export type UpdateEditorAction = ReturnType<typeof updateEditorAction>;
export type EditorSubmitAction = ReturnType<typeof handleEditorSubmit>;
export type EditorSuccessAction = ReturnType<typeof handleEditorSuccess>;
export type EditorErrorAction = ReturnType<typeof handleEditorError>;
export type EditorResetAction = ReturnType<typeof resetEditor>;

export type EditorAction =
  | UpdateEditorAction
  | EditorSubmitAction
  | EditorSuccessAction
  | EditorErrorAction
  | EditorResetAction;

/**
 * Action creator for update editor
 */
export function updateEditorAction<T>(id: string, store: string, dto: T, validator: Results<ResultBase> | null) {
  const payload = { id, store, dto, validator };
  return createAction("EDITOR_UPDATE", payload);
}

/**
 * action creator for handle editor submit
 */
export function handleEditorSubmit<T>(id: string, store: string, dto: T, validator: Results<ResultBase> | null) {
  return createAction("EDITOR_SUBMIT", { id, store, dto, validator });
}

/**
 * action creator for editor submit success
 */
export function handleEditorSuccess(id: string, editorStore: string) {
  return createAction("EDITOR_SUBMIT_SUCCESS", { id, store: editorStore });
}

interface HandleEditorErrorParams<T> {
  id: string;
  store: string;
  dto: T;
  error: IAppError;
  scrollToTop?: boolean;
}

/**
 * Action creator for handle editor error
 */
export function handleEditorError<T>({ id, store, dto, error, scrollToTop = true }: HandleEditorErrorParams<T>) {
  if (scrollToTop) scrollToTheTopSmoothly();
  if (error.code === ErrorCode.VALIDATION_ERROR) {
    return updateEditorAction(id, store, dto, error.results ?? null);
  }
  return createAction("EDITOR_SUBMIT_ERROR", { id, store, dto, error });
}

/**
 * Action creator for reset the editor
 */
export function resetEditor<TDto>(id: string, store: string, dto: TDto, validator: Results<ResultBase> | null) {
  return createAction("EDITOR_RESET", { id, store, dto, validator });
}
