import { DataLoadAction } from "../actions/common";
import { combineReducers } from "redux";
import { ActionTransitionStart } from "redux-router5";
import { LoadingStatus } from "../../../shared/pending";
import { ProjectDto } from "../../../types";

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
      if (pending.status === LoadingStatus.Done) {
        result[itemKey] = { status: LoadingStatus.Stale, data: pending.data, error: pending.error };
      }
    });
    return result;
  }

  return state;
};

// TODO remove key function
export const dataReducer = combineReducers({
  claims: dataStoreReducer<ClaimDto[], string>(x => x, "claims"),
  claim: dataStoreReducer<ClaimDto, string>(x => x, "claim"),
  claimDetails: dataStoreReducer<ClaimDetailsDto[], string>(x => x || "empty", "claimDetails"),
  claimDetailsSummary: dataStoreReducer<ClaimDetailsSummaryDto[], string>(x => x || "empty", "claimDetailsSummary"),
  claimLineItems: dataStoreReducer<ClaimLineItemDto[], string>(x => x || "empty", "claimLineItems"),
  contacts: dataStoreReducer<IContact[], string>(x => x, "contacts"),
  contact: dataStoreReducer<IContact, string>(x => x, "contact"),
  costCategories:dataStoreReducer<CostCategoryDto[], string>(x => x, "costCategories"),
  documents: dataStoreReducer<DocumentSummaryDto[], string>(x => x, "documents"),
  forecastDetails: dataStoreReducer<ForecastDetailsDTO[], string>(x => x, "forecastDetails"),
  forecastDetail: dataStoreReducer<ForecastDetailsDTO, string>(x => x, "forecastDetail"),
  forecastGolCosts: dataStoreReducer<GOLCostDto[], string>(x => x, "forecastGolCosts"),
  partners: dataStoreReducer<PartnerDto[], string>(x => x, "partners"),
  partner: dataStoreReducer<PartnerDto, string>(x => x, "partner"),
  project: dataStoreReducer<ProjectDto, string>(x => x, "project"),
  projects: dataStoreReducer<ProjectDto[], string>(x => x, "projects"),
  projectContacts: dataStoreReducer<ProjectContactDto[], string>(x => x, "projectContacts")
});
