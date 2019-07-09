import { combineReducers } from "redux";
import { ActionTransitionStart, actionTypes } from "redux-router5";
import { DataLoadAction } from "../actions/common";
import { LoadingStatus } from "../../../shared/pending";
import {
  ClaimDto,
  ClaimStatusChangeDto,
  IAppError,
  MonitoringReportDto,
  MonitoringReportQuestionDto,
  MonitoringReportStatusChangeDto,
  MonitoringReportSummaryDto,
  PartnerDto,
  ProjectDto, ProjectRole
} from "@framework/types";

export interface IDataStore<T> {
  status: LoadingStatus;
  data: T;
  error: IAppError | null;
}

const dataStoreReducer = <TData extends {}>(storeKey: string) =>
  (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction | ActionTransitionStart) => {
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

  if (action.type === actionTypes.TRANSITION_START && action.payload.previousRoute !== null) {
    const result = Object.assign({}, state);
    Object.keys(result).forEach(itemKey => {
      const pending = result[itemKey];
      if (pending.status === LoadingStatus.Done || pending.status === LoadingStatus.Failed || pending.status === LoadingStatus.Updated) {
        result[itemKey] = { status: LoadingStatus.Stale, data: pending.data, error: pending.error };
      }
    });
    return result;
  }

  return state;
};

export const dataReducer = combineReducers({
  claims: dataStoreReducer<ClaimDto[]>("claims"),
  claim: dataStoreReducer<ClaimDto>("claim"),
  claimDetail: dataStoreReducer<ClaimDetailsDto>("claimDetail"),
  claimDetails: dataStoreReducer<ClaimDetailsSummaryDto[]>("claimDetails"),
  claimStatusChanges: dataStoreReducer<ClaimStatusChangeDto[]>("claimStatusChanges"),
  costsSummary: dataStoreReducer<CostsSummaryForPeriodDto[]>("costsSummary"),
  contacts: dataStoreReducer<IContact[]>("contacts"),
  costCategories:dataStoreReducer<CostCategoryDto[]>("costCategories"),
  documents: dataStoreReducer<DocumentSummaryDto[]>("documents"),
  forecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("forecastDetails"),
  forecastDetail: dataStoreReducer<ForecastDetailsDTO>("forecastDetail"),
  forecastGolCosts: dataStoreReducer<GOLCostDto[]>("forecastGolCosts"),
  monitoringReport: dataStoreReducer<MonitoringReportDto>("monitoringReport"),
  monitoringReports: dataStoreReducer<MonitoringReportSummaryDto[]>("monitoringReports"),
  monitoringReportQuestions: dataStoreReducer<MonitoringReportQuestionDto[]>("monitoringReportQuestions"),
  monitoringReportStatusChanges: dataStoreReducer<MonitoringReportStatusChangeDto[]>("monitoringReportStatusChanges"),
  partner: dataStoreReducer<PartnerDto>("partner"),
  partners: dataStoreReducer<PartnerDto[]>("partners"),
  project: dataStoreReducer<ProjectDto>("project"),
  projects: dataStoreReducer<ProjectDto[]>("projects"),
  projectContacts: dataStoreReducer<ProjectContactDto[]>("projectContacts"),
  user: dataStoreReducer<{[key: string]: ProjectRole}>("user")
});
