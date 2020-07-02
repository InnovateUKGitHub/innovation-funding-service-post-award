import { AsyncThunk, createAction } from "./createAction";
import { LoadingStatus } from "../../../../shared/pending";
import { IDataSelector } from "../../selectors/common";
import { IClientUser } from "@framework/types";

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
  selector: IDataSelector<T>,
  load: (params: {user: IClientUser}) => Promise<T>
): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const id = selector.key;
    const store = selector.store;
    const existing = selector.get(state);
    const reloads = [
      LoadingStatus.Preload,
      LoadingStatus.Stale,
    ];

    if (!existing || reloads.indexOf(existing.status) !== -1) {
      dispatch(dataLoadAction(id, store, LoadingStatus.Loading, existing && existing.data));

      return load({user: state.user})
        .then((result) => {
          dispatch(dataLoadAction(id, store, LoadingStatus.Done, result));
        })
        .catch(err => {
          dispatch(dataLoadAction(id, store, LoadingStatus.Failed, null, err));
        });
    }
    else {
      return Promise.resolve();
    }
  };
}
