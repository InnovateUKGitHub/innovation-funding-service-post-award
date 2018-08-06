import { ActionWithPayload, AsyncThunk, createAction } from "./common";
import { DataKeys, DataStore } from "../reducers/common";
import { RootState } from "../reducers";
import { ThunkAction } from "../../../node_modules/redux-thunk";

type DataLoadThunk = ReturnType<typeof createLoadAction>
export type DataLoadAction = ReturnType<DataLoadThunk>;
export type DataLoadKeys = "all" | number;

export function createLoadAction(id: DataLoadKeys, store: DataKeys) {
  return (status: string, data: any, error?: any) => {
    const payload = { id, store, status, data, error };
    return createAction("DATA_LOAD", payload);
  }
}

// change to just handle promise?
// or pass through get id etc
export function conditionalLoad<T>(
  selector: (state: RootState) => DataStore<T>,
  action: DataLoadThunk,
  load: () => Promise<T>
): AsyncThunk<T, DataLoadAction>  {
  return (dispatch, getState) => {
    let state    = getState();
    let existing = selector(state);
    
    if(!existing || existing.status === "PRELOAD" || existing.status === "STALE") {
      dispatch(action("LOADING", existing && existing.data));

      return load()
        .then((result: any) => !!result.json ? result.json() : result)
        // .then((result: any) => result.json())
        .catch((r: any) => console.log("API ERROR", r))
        .then((result: T) => {
          dispatch(action("LOADED", result));
          return result;
        });
    }

    return Promise.reject();
  };
}
