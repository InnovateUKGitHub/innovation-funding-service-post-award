import { DataLoadAction } from "../actions/dataLoad";
import { Contact } from "../../models";

export interface DataStore<T> {
  status: string;
  data: T;
  error: any;
}

const initialState = {
  contacts: {} as { [k: string]: DataStore<Contact> }
};

export type DataState     = typeof initialState;
export type DataKeys      = keyof DataState;
export type CommonReducer = ReturnType<typeof CommonReducer>

export function CommonReducer(state: DataState = initialState, action: DataLoadAction): DataState {
  if(action.type === "DATA_LOAD") {
    let id = action.payload.id;
    let store = state[action.payload.store];
    let existing = store && store[id];

    let pending: any = {
      status: action.payload.status,
      data: action.payload.data,
      error: action.payload.error
    };

    if(!pending.data && existing && existing.data) {
      pending.data = existing.data;
    }

    let result: any = Object.assign({}, state);
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