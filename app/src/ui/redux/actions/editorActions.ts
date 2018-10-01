import { createAction } from "./common";

type UpdateEditorThunk = typeof updateEditorAction;
export type UpdateEditorAction = ReturnType<UpdateEditorThunk>;

export function updateEditorAction<T>(
    id: string,
    store: string,
    dto: any,
    validator: any,
    error?: any
) {
    const payload = { id, store, dto, validator, error };
    return createAction("VALIDATE", payload);
}
