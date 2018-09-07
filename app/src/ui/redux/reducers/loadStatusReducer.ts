import { DataLoadAction } from "../actions/dataLoad";
import { LoadingStatus } from "../../../shared/pending";

/// A reducer that monitors data loading to set a global variable that the selenium test framework can use to watch for pages to be ready to test
export const loadStatusReducer = (state: number = 0, action: DataLoadAction) => {
    if (action.type === "DATA_LOAD") {
        if (action.payload.status === LoadingStatus.Loading) {
            return state > 0 ? state + 1 : 1;
        }
        else if (action.payload.status === LoadingStatus.Done || action.payload.status === LoadingStatus.Failed) {
            return state > 0 ? state - 1 : 0;
        }
    }
    return state;
};
