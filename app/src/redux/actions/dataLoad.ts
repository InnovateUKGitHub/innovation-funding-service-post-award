import { AsyncThunk, createAction } from "./common";
import { DataStoreKeys, DataStoreStatus, IDataStore, RootState } from "../reducers";

type DataLoadThunk         = typeof dataLoadAction;
export type DataStoreId    = "all" | number;
export type DataLoadAction = ReturnType<DataLoadThunk>;

export function dataLoadAction(
  id: DataStoreId,
  store: DataStoreKeys,
  status: DataStoreStatus,
  data: any,
  error?: any
) {
  const payload = { id, store, status, data, error };
  return createAction("DATA_LOAD", payload);
}

export function conditionalLoad<T>(
  idSelector: (state: RootState) => DataStoreId,
  storeSelector: (state: RootState) => DataStoreKeys,
  existingSelector: (state: RootState) => IDataStore<T>,
  load: () => Promise<T>
): AsyncThunk<T, DataLoadAction> {
  return (dispatch, getState) => {
    const state    = getState();
    const id       = idSelector(state);
    const store    = storeSelector(state);
    const existing = existingSelector(state);

    if(!existing || existing.status === "LOADED" || existing.status === "STALE") {
      dispatch(dataLoadAction(id, store, "LOADING", existing && existing.data));

      return load()
        .then((result: any) => !!result.json ? result.json() : result)
        // .then((result: any) => result.json())
        .catch((r: any) => { console.log("API ERROR", r); })
        .then((result: T) => {
          dispatch(dataLoadAction(id, store, "LOADED", result));
          return result;
        });
    }

    return Promise.reject();
  };
}
