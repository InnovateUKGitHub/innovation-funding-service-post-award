import { combineReducers } from "redux";
import { ActionTransitionSuccess, actionTypes } from "redux-router5";
import { DataLoadAction } from "../actions/common";
import { LoadingStatus } from "../../../shared/pending";
import * as Dtos from "@framework/dtos";
import { IAppError } from "@framework/types";

export interface IDataStore<T> {
  status: LoadingStatus;
  data: T;
  error: IAppError | null;
}

const dataStoreReducer = <TData extends {}>(storeKey: string) => (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction | ActionTransitionSuccess) => {
  if (action.type === "DATA_LOAD" && action.payload.store === storeKey) {
    const existing = state[action.payload.id];
    const err = action.payload.error;

    const pending: IDataStore<TData> = {
      status: action.payload.status,
      data: action.payload.data || (existing && existing.data),
      error: err && { code: err.code, message: err.message, results: err.results }
    };

    return Object.assign({}, state, { [action.payload.id]: pending });
  }

  if (action.type === actionTypes.TRANSITION_SUCCESS) {
    const hasPreviousRoute = action.payload.previousRoute !== null;
    const isReplacing = (action.payload.route && action.payload.route.meta && action.payload.route.meta && action.payload.route.meta.options.replace === true) || false;
    if (hasPreviousRoute && !isReplacing) {
      const result = Object.assign({}, state);
      Object.keys(result).forEach(itemKey => {
        const pending = result[itemKey];
        if (pending.status === LoadingStatus.Done || pending.status === LoadingStatus.Failed || pending.status === LoadingStatus.Updated) {
          result[itemKey] = { status: LoadingStatus.Stale, data: pending.data, error: pending.error };
        }
      });
      return result;
    }
  }

  return state;
};

export const dataReducer = combineReducers({
  claims: dataStoreReducer<Dtos.ClaimDto[]>("claims"),
  claim: dataStoreReducer<Dtos.ClaimDto>("claim"),
  claimDetail: dataStoreReducer<ClaimDetailsDto>("claimDetail"),
  claimDetails: dataStoreReducer<ClaimDetailsSummaryDto[]>("claimDetails"),
  claimStatusChanges: dataStoreReducer<Dtos.ClaimStatusChangeDto[]>("claimStatusChanges"),
  costsSummary: dataStoreReducer<CostsSummaryForPeriodDto[]>("costsSummary"),
  contacts: dataStoreReducer<IContact[]>("contacts"),
  costCategories: dataStoreReducer<CostCategoryDto[]>("costCategories"),
  documents: dataStoreReducer<DocumentSummaryDto[]>("documents"),
  forecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("forecastDetails"),
  forecastDetail: dataStoreReducer<ForecastDetailsDTO>("forecastDetail"),
  forecastGolCosts: dataStoreReducer<GOLCostDto[]>("forecastGolCosts"),
  monitoringReport: dataStoreReducer<Dtos.MonitoringReportDto>("monitoringReport"),
  monitoringReports: dataStoreReducer<Dtos.MonitoringReportSummaryDto[]>("monitoringReports"),
  monitoringReportQuestions: dataStoreReducer<Dtos.MonitoringReportQuestionDto[]>("monitoringReportQuestions"),
  monitoringReportStatusChanges: dataStoreReducer<Dtos.MonitoringReportStatusChangeDto[]>("monitoringReportStatusChanges"),
  partner: dataStoreReducer<Dtos.PartnerDto>("partner"),
  partners: dataStoreReducer<Dtos.PartnerDto[]>("partners"),
  pcrs: dataStoreReducer<Dtos.PCRSummaryDto[]>("pcrs"),
  pcr: dataStoreReducer<Dtos.PCRDto>("pcr"),
  pcrTypes: dataStoreReducer<Dtos.PCRItemTypeDto[]>("pcrTypes"),
  project: dataStoreReducer<Dtos.ProjectDto>("project"),
  projects: dataStoreReducer<Dtos.ProjectDto[]>("projects"),
  projectChangeRequestStatusChanges: dataStoreReducer<Dtos.ProjectChangeRequestStatusChangeDto[]>("projectChangeRequestStatusChanges"),
  projectContacts: dataStoreReducer<ProjectContactDto[]>("projectContacts"),
  user: dataStoreReducer<{ [key: string]: Dtos.ProjectRole }>("user")
});
