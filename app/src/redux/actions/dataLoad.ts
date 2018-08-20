import { AsyncThunk, createAction } from "./common";
import { DataStoreStatus, IDataStore, RootState } from "../reducers";

type DataLoadThunk = typeof dataLoadAction;
export type DataStoreId = "all" | number;
export type DataLoadAction = ReturnType<DataLoadThunk>;

export function dataLoadAction(
  id: string,
  store: string,
  status: DataStoreStatus,
  data: any,
  error?: any
) {
  const payload = { id, store, status, data, error };
  return createAction("DATA_LOAD", payload);
}

export function conditionalLoad<T>(
  idSelector: string,
  storeSelector: string,
  load: () => Promise<T>
): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const id = idSelector;
    const store = storeSelector;
    const existing = ((state as any).data[store] as any)[id] as IDataStore<T>;

    if (!existing || existing.status === "LOADED" || existing.status === "STALE") {
      dispatch(dataLoadAction(id, store, "LOADING", existing && existing.data));
      return load()
        .catch(err  => {
          dispatch(dataLoadAction(id, store, "ERROR", null, err));
          return;
        })
        .then((result) => {
          dispatch(dataLoadAction(id, store, "LOADED", result));
          return;
        });
    }
    else{
      return Promise.resolve();
    }
  };
}
