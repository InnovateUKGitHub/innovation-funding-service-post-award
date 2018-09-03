import { Reducer, AnyAction } from "redux";
import { DataLoadAction } from "../actions/dataLoad";

const canUseDOM = !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

const pageLoadStatus = "__PAGE_LOAD_STATUS__";

if (canUseDOM) {
    (window as any)[pageLoadStatus] = true;
}

/// A reducer that monitors data loading to set a global variable that the selenium test framework can use to watch for pages to be ready to test
export const loadStatusReducer: Reducer<number> = (state: number = 0, action: DataLoadAction | AnyAction) => {
    if (action.type === "DATA_LOAD") {
        let current = state;
        
        if (action.payload.status === "LOADING") {
            current++;
        }
        else if (action.payload.status === "LOADED" || action.payload.status === "ERROR") {
            current--;
        }

        if (canUseDOM) {
            (window as any)[pageLoadStatus] = current === 0;
        }

        return current;
    }
    return state;
}