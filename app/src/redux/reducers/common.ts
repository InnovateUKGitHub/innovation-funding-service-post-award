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

  if ((action as any).type === "@@router5/TRANSITION_START") {
    const result = Object.assign({}, state);
    Object.keys(result).forEach(itemKey => {
      const pending = result[itemKey];
      if (pending.status === "LOADED" || pending.status === "ERROR") {
        result[itemKey] = { status: "STALE", data: pending.data, error: pending.error };
      }
    });
    return result;
  }
  return state;
};

export const dataReducer = combineReducers({
  contacts: dataStoreReducer<Dtos.IContact[], string>(x => x, "contacts"),
  contact: dataStoreReducer<Dtos.IContact, string>(x => x, "contact"),
  partners: dataStoreReducer<Dtos.PartnerDto[], string>(x => x, "partners"),
  project: dataStoreReducer<Dtos.ProjectDto, string>(x => x, "project"),
  projects: dataStoreReducer<Dtos.ProjectDto[], string>(x => x, "projects"),
  projectContacts: dataStoreReducer<Dtos.ProjectContactDto[], string>(x => x, "projectContacts")
});
