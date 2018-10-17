import { createAction } from "./common";
import {Results} from "../../validation/results";

type UpdateEditorThunk = typeof updateEditorAction;
export type UpdateEditorAction = ReturnType<UpdateEditorThunk>;

export function updateEditorAction<T>(
    id: string,
    store: string,
    dto: T,
    validator: Results<T>,
    error?: any
) {
    const payload = { id, store, dto, validator, error };
    return createAction("VALIDATE", payload);
}
