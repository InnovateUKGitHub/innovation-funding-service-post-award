import { DataLoadAction } from "../actions/dataLoad";
import * as Dtos from "../../models";
import { combineReducers } from "redux";

export type DataStoreStatus = "PRELOAD" | "STALE" | "LOADING" | "LOADED" | "ERROR";

export interface IDataStore<T> {
  status: DataStoreStatus;
  data: T;
  error: any;
}

export const dataStoreReducer = <TData extends {}, TKey>(key: (key: TKey) => string, storeKey: string) => (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction) => {
  if (action.type === "DATA_LOAD" && action.payload.store === storeKey) {

    const existing = state[action.payload.id];

    const pending: IDataStore<TData> = {
      status: action.payload.status,
      data: action.payload.data || (existing && existing.data),
      error: action.payload.error
    };

    const result = Object.assign({}, state);
    result[action.payload.id] = pending;
    return result;
  }
  if ((action as any).type == "@@router5/TRANSITION_START") {
    let result = Object.assign({}, state);
    Object.keys(result).forEach(store => Object.keys(result[store]).forEach(key => {
      let pending = result[key];
      if (pending.status === "LOADED" || pending.status === "ERROR") {
        console.log("making stores stale", store, key, pending);
        result[key] = { status: "STALE", data: pending.data, error: pending.error };
      }
    }));
    return result;
  }
  return state;
}

export const dataReducer = combineReducers({
  contacts: dataStoreReducer<Dtos.IContact[], string>(x => x, "contacts"),
  contact: dataStoreReducer<Dtos.IContact, string>(x => x, "contact"),
  partners: dataStoreReducer<Dtos.PartnerDto[], string>(x => x, "partners"),
  project: dataStoreReducer<Dtos.ProjectDto, string>(x => x, "project"),
  projectContacts: dataStoreReducer<Dtos.ProjectContactDto[], string>(x => x, "projectContacts")
});

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
