import { AsyncThunk, createAction } from "./common";
import { DataStateKeys, IDataStore } from "../reducers";
import { LoadingStatus } from "../../../shared/pending";
import { IUser } from "../../../shared/IUser";

type DataLoadThunk = typeof dataLoadAction;
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
  storeSelector: DataStateKeys,
  load: (params: {user: IUser}) => Promise<T>
): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const id = idSelector;
    const store = storeSelector;
    const existing = (state.data as any)[store][id] as IDataStore<T>;

    if (!existing || existing.status === LoadingStatus.Preload || existing.status === LoadingStatus.Stale) {
      dispatch(dataLoadAction(id, store, LoadingStatus.Loading, existing && existing.data));

      return load({user: state.user})
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
