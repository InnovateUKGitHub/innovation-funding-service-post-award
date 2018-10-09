import { DataLoadAction } from "../actions/dataLoad";
import * as Dtos from "../../models";
import { combineReducers } from "redux";
import { ActionTransitionStart } from "redux-router5";
import { LoadingStatus } from "../../../shared/pending";

export interface IDataStore<T> {
  status: LoadingStatus;
  data: T;
  error: any;
}

export const dataStoreReducer = <TData extends {}, TKey>(key: (key: TKey) => string, storeKey: string) =>
  (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction | ActionTransitionStart) => {
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

  if (action.type === "@@router5/TRANSITION_START" && action.payload.previousRoute !== null) {
    const result = Object.assign({}, state);
    Object.keys(result).forEach(itemKey => {
      const pending = result[itemKey];
      if (pending.status === LoadingStatus.Done || pending.status === LoadingStatus.Failed) {
        result[itemKey] = { status: LoadingStatus.Stale, data: pending.data, error: pending.error };
      }
    });
    return result;
  }

  return state;
};

export const dataReducer = combineReducers({
  claims: dataStoreReducer<Dtos.ClaimDto[], string>(x => x, "claims"),
  claim: dataStoreReducer<Dtos.ClaimDto, string>(x => x, "claim"),
  claimDetails: dataStoreReducer<Dtos.ClaimDetailsDto[], string>(x => x || "empty", "claimDetails"),
  claimDetailsSummary: dataStoreReducer<Dtos.ClaimDetailsSummaryDto[], string>(x => x || "empty", "claimDetailsSummary"),
  claimLineItems: dataStoreReducer<Dtos.ClaimLineItemDto[], string>(x => x || "empty", "claimLineItems"),
  contacts: dataStoreReducer<Dtos.IContact[], string>(x => x, "contacts"),
  contact: dataStoreReducer<Dtos.IContact, string>(x => x, "contact"),
  costCategories:dataStoreReducer<Dtos.CostCategoryDto[], string>(x => x, "costCategories"),
  partners: dataStoreReducer<Dtos.PartnerDto[], string>(x => x, "partners"),
  partner: dataStoreReducer<Dtos.PartnerDto, string>(x => x, "partner"),
  project: dataStoreReducer<Dtos.ProjectDto, string>(x => x, "project"),
  projects: dataStoreReducer<Dtos.ProjectDto[], string>(x => x, "projects"),
  projectContacts: dataStoreReducer<Dtos.ProjectContactDto[], string>(x => x, "projectContacts")
});
