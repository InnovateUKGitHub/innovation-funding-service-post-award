import { DataLoadAction } from "../actions/dataLoad";
import { IContact } from "../../models";

export type DataStoreStatus = "PRELOAD" | "STALE" | "LOADING" | "LOADED";

export interface IDataStore<T> {
  status: DataStoreStatus;
  data: T;
  error: any;
}

export type DataStoreState = typeof initialState;
export type DataStoreKeys  = keyof DataStoreState;
export type CommonReducer  = ReturnType<typeof CommonReducer>;

const initialState = {
  contacts: {} as { [k: string]: IDataStore<IContact> }
};

export function CommonReducer(state: DataStoreState = initialState, action: DataLoadAction): DataStoreState {
  if(action.type === "DATA_LOAD") {
    const id       = action.payload.id;
    const store    = state[action.payload.store];
    const existing = store && store[id];

    const pending: IDataStore<any> = {
      status: action.payload.status,
      data: action.payload.data,
      error: action.payload.error
    };

    if(!pending.data && existing && existing.data) {
      pending.data = existing.data;
    }

    const result: any = Object.assign({}, state);
    result[action.payload.store] = result[action.payload.store] || {};
    result[action.payload.store][id] = pending;

    return result;
  }

  // if(action.type =="@@router5/TRANSITION_START") {
  //     let result = Object.assign({}, state);
  //     Object.keys(result).forEach(store => Object.keys(result[store]).forEach(key => {
  //         let pending = result[store][key];
  //         if(pending.status && pending.status !== "STALE"){
  //             console.log("making stores stale", store, key, pending);
  //             result[store][key] = { status: "STALE", data: pending.data, error: pending.error};
  //         }
  //     }))
  //     console.log("making stores stale", state, result);
  //     return result;
  // }

  return state;
}
