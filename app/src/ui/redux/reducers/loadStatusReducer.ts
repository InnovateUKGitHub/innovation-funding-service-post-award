import { DataLoadAction, EditorErrorAction, EditorSubmitAction, EditorSuccessAction } from "../actions/common";
import { LoadingStatus } from "../../../shared/pending";

const increment = (state: number) => state > 0 ? state + 1 : 1;
const decrement = (state: number) => state > 0 ? state - 1 : 0;

/// A reducer that monitors data loading to set a global variable that the selenium test framework can use to watch for pages to be ready to test
export const loadStatusReducer = (state: number = 0, action: DataLoadAction | EditorSubmitAction | EditorSuccessAction | EditorErrorAction) => {
    if (action.type === "DATA_LOAD" && action.payload.status === LoadingStatus.Loading) {
        return increment(state);
    }

    if (action.type === "DATA_LOAD" && action.payload.status === LoadingStatus.Done) {
        return decrement(state);
    }

    if (action.type === "DATA_LOAD" && action.payload.status === LoadingStatus.Failed) {
        return decrement(state);
    }

    if (action.type === "EDITOR_SUBMIT") {
        return increment(state);
    }

    if (action.type === "EDITOR_SUBMIT_SUCCESS") {
        return decrement(state);
    }

    if (action.type === "EDITOR_SUBMIT_ERROR") {
        return decrement(state);
    }

    return state;
};
