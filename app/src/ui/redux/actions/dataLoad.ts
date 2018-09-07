import { AsyncThunk, createAction } from "./common";
import { IDataStore } from "../reducers";
import { LoadingStatus } from "../../../shared/pending";

type DataLoadThunk = typeof dataLoadAction;
export type DataStoreId = "all" | number;
export type DataLoadAction = ReturnType<DataLoadThunk>;

export function dataLoadAction(
  id: string,
  store: string,
  status: LoadingStatus,
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
    // tslint:disable-next-line
    const existing = ((state.data as any)[store] as any)[id] as IDataStore<T>;

    if (!existing || existing.status === LoadingStatus.Preload || existing.status === LoadingStatus.Stale) {
      dispatch(dataLoadAction(id, store, LoadingStatus.Loading, existing && existing.data));
      return load()
        .then((result) => {
          dispatch(dataLoadAction(id, store, LoadingStatus.Done, result));
          return;
        })
        .catch(err => {
          dispatch(dataLoadAction(id, store, LoadingStatus.Failed, null, err));
          return;
        });
    }
    else {
      return Promise.resolve();
    }
  };
}
