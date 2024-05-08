import { LoadingStatus } from "@framework/constants/enums";
import { IAppError } from "@framework/types/IAppError";
import { IDataSelector } from "@ui/redux/selectors/common/data";
import { AsyncThunk, createAction } from "./createAction";
import { IRequest } from "@framework/types/IRequest";

type DataLoadThunk = typeof dataLoadAction;
export type DataLoadAction = ReturnType<DataLoadThunk>;

/**
 * Data Load action creator.
 * Data is as close to _any_ type as it's possible to be.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dataLoadAction(id: string, store: string, status: LoadingStatus, data: any, error?: IAppError | null) {
  const payload = { id, store, status, data, error };
  return createAction("DATA_LOAD", payload);
}

/**
 * Conditional Load action creator
 */
export function conditionalLoad<T>(
  selector: IDataSelector<T>,
  load: (params: IRequest) => Promise<T>,
): AsyncThunk<void, DataLoadAction> {
  return (dispatch, getState) => {
    const state = getState();
    const id = selector.key;
    const store = selector.store;
    const existing = selector.get(state);
    const reloads = [LoadingStatus.Preload, LoadingStatus.Stale];

    if (!existing || reloads.indexOf(existing.status) !== -1) {
      dispatch(dataLoadAction(id, store as string, LoadingStatus.Loading, existing && existing.data));

      return load({ user: state.user })
        .then(result => {
          dispatch(dataLoadAction(id, store as string, LoadingStatus.Done, result));
        })
        .catch(err => {
          dispatch(dataLoadAction(id, store as string, LoadingStatus.Failed, null, err));
        });
    } else {
      return Promise.resolve();
    }
  };
}
