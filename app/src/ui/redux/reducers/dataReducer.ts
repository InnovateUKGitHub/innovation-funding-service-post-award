import { combineReducers } from "redux";
import { ActionTransitionSuccess, actionTypes } from "redux-router5";
import { DataLoadAction } from "../actions/common";
import { LoadingStatus } from "../../../shared/pending";
import * as Dtos from "@framework/dtos";
import { IAppError, PCRParticipantSize, PCRPartnerType, PCRProjectRole } from "@framework/types";
import { State } from "router5";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

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

    const options = getRouteTransitionOptions(action.payload);
    if (options.hasPreviousRoute && !options.isReplacing && !options.preserveData) {
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

function getRouteTransitionOptions(payload: { route: State, previousRoute: State }) {
  const hasPreviousRoute = payload.previousRoute !== null;
  const options = payload && payload.route && payload.route.meta && payload.route.meta.options || {};

  return {
    isReplacing: options.replace || false,
    preserveData: options.preserveData || false,
    hasPreviousRoute
  };
}

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
  financialVirement: dataStoreReducer<FinancialVirementDto>("financialVirement"),
  forecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("forecastDetails"),
  initialForecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("initialForecastDetails"),
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
  pcrParticipantSizes: dataStoreReducer<Dtos.Option<PCRParticipantSize>[]>("pcrParticipantSizes"),
  pcrProjectRoles: dataStoreReducer<Dtos.Option<PCRProjectRole>[]>("pcrProjectRoles"),
  pcrPartnerTypes: dataStoreReducer<Dtos.Option<PCRPartnerType>[]>("pcrPartnerTypes"),
  project: dataStoreReducer<Dtos.ProjectDto>("project"),
  projects: dataStoreReducer<Dtos.ProjectDto[]>("projects"),
  projectChangeRequestStatusChanges: dataStoreReducer<Dtos.ProjectChangeRequestStatusChangeDto[]>("projectChangeRequestStatusChanges"),
  projectContacts: dataStoreReducer<ProjectContactDto[]>("projectContacts"),
  user: dataStoreReducer<{ [key: string]: Dtos.ProjectRole }>("user")
});
