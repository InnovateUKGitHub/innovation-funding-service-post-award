import { AsyncThunk, createAction } from "./common";
import { DataKeys, DataStoreStatus, IDataStore, RootState } from "../reducers";

type DataLoadThunk         = ReturnType<typeof createLoadAction>;
export type DataLoadAction = ReturnType<DataLoadThunk>;
export type DataLoadKeys   = "all" | number;

export function createLoadAction(id: DataLoadKeys, store: DataKeys) {
  return (status: DataStoreStatus, data: any, error?: any) => {
    const payload = { id, store, status, data, error };
    return createAction("DATA_LOAD", payload);
  };
}

// change to just handle promise?
// or pass through get id etc
export function conditionalLoad<T>(
  selector: (state: RootState) => IDataStore<T>,
  action: DataLoadThunk,
  load: () => Promise<T>
): AsyncThunk<T, DataLoadAction> {
  return (dispatch, getState) => {
    const state    = getState();
    const existing = selector(state);

    if(!existing || existing.status === "LOADED" || existing.status === "STALE") {
      dispatch(action("LOADING", existing && existing.data));

      return load()
        .then((result: any) => !!result.json ? result.json() : result)
        // .then((result: any) => result.json())
        .catch((r: any) => { console.log("API ERROR", r); })
        .then((result: T) => {
          dispatch(action("LOADED", result));
          return result;
        });
    }

    return Promise.reject();
  };
}
