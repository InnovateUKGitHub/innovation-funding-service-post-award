import {Middleware, Dispatch, AnyAction, MiddlewareAPI} from "redux";
import {RootState} from "../reducers/rootReducer";

const pageLoadStatus = "__PAGE_LOAD_STATUS__";

// cannot be used on server!!! 
export const loadStatusMiddleware = (store:MiddlewareAPI<Dispatch, RootState>) => (next: Dispatch) => (action: AnyAction) => {
    next(action);
    let loadStatus = store.getState().loadStatus;
    (window as any)[pageLoadStatus] = loadStatus === 0;
}