import { combineReducers } from "redux";
import { ActionTransitionSuccess, actionTypes } from "redux-router5";
import * as Dtos from "@framework/dtos";
import {
  ClaimDetailsDto,
  ClaimDetailsSummaryDto,
  CostsSummaryForPeriodDto,
  FinancialLoanVirementDto,
  FinancialVirementDto,
  ForecastDetailsDTO,
  GOLCostDto,
  IAppError,
  IContact,
  LoadingStatus,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRSpendProfileCapitalUsageType,
  PCRSpendProfileOverheadRate,
  ProjectContactDto,
  ProjectRole,
  TotalCosts
} from "@framework/types";
import { State } from "router5";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DataLoadAction } from "../actions/common";

export interface IDataStore<T> {
  status: LoadingStatus;
  data: T;
  error: IAppError | null;
}

const dataStoreReducer = <TData extends {}>(storeKey: string) => (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction | ActionTransitionSuccess) => {
  if (action.type === "DATA_LOAD" && action.payload?.store === storeKey) {
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

function getRouteTransitionOptions(payload: { route: State; previousRoute: State }) {
  const hasPreviousRoute = payload.previousRoute !== null;
  const options = payload && payload.route && payload.route.meta && payload.route.meta.options || {};

  return {
    isReplacing: options.replace || false,
    preserveData: options.preserveData || false,
    hasPreviousRoute
  };
}

export const dataReducer = combineReducers({
  jesOnlyAccounts: dataStoreReducer<Dtos.AccountDto[]>("jesOnlyAccounts"),
  broadcasts: dataStoreReducer<Dtos.BroadcastDto[]>("broadcasts"),
  broadcast: dataStoreReducer<Dtos.BroadcastDto>("broadcast"),
  claims: dataStoreReducer<Dtos.ClaimDto[]>("claims"),
  claim: dataStoreReducer<Dtos.ClaimDto>("claim"),
  claimTotalCosts: dataStoreReducer<TotalCosts>("claimTotalCosts"),
  claimDetail: dataStoreReducer<ClaimDetailsDto>("claimDetail"),
  claimDetails: dataStoreReducer<ClaimDetailsSummaryDto[]>("claimDetails"),
  claimStatusChanges: dataStoreReducer<Dtos.ClaimStatusChangeDto[]>("claimStatusChanges"),
  companies: dataStoreReducer<Dtos.CompanyDto[]>("companies"),
  costsSummary: dataStoreReducer<CostsSummaryForPeriodDto[]>("costsSummary"),
  costCategories: dataStoreReducer<CostCategoryDto[]>("costCategories"),
  contacts: dataStoreReducer<IContact[]>("contacts"),
  documents: dataStoreReducer<DocumentSummaryDto[]>("documents"),
  financialVirement: dataStoreReducer<FinancialVirementDto>("financialVirement"),
  financialLoanVirement: dataStoreReducer<FinancialLoanVirementDto>("financialLoanVirement"),
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
  pcrAvailableTypes: dataStoreReducer<Dtos.PCRItemTypeDto[]>("pcrAvailableTypes"),
  pcrTimeExtensionOptions: dataStoreReducer<Dtos.PCRTimeExtensionOption[]>("pcrTimeExtensionOptions"),
  pcrParticipantSizes: dataStoreReducer<Dtos.Option<PCRParticipantSize>[]>("pcrParticipantSizes"),
  pcrProjectLocations: dataStoreReducer<Dtos.Option<PCRProjectLocation>[]>("pcrProjectLocations"),
  pcrProjectRoles: dataStoreReducer<Dtos.Option<PCRProjectRole>[]>("pcrProjectRoles"),
  pcrPartnerTypes: dataStoreReducer<Dtos.Option<PCRPartnerType>[]>("pcrPartnerTypes"),
  pcrSpendProfileCapitalUsageTypes: dataStoreReducer<Dtos.Option<PCRSpendProfileCapitalUsageType>[]>("pcrSpendProfileCapitalUsageTypes"),
  pcrSpendProfileOverheadRateOptions: dataStoreReducer<Dtos.Option<PCRSpendProfileOverheadRate>[]>("pcrSpendProfileOverheadRateOptions"),
  project: dataStoreReducer<Dtos.ProjectDto>("project"),
  projects: dataStoreReducer<Dtos.ProjectDto[]>("projects"),
  projectChangeRequestStatusChanges: dataStoreReducer<Dtos.ProjectChangeRequestStatusChangeDto[]>("projectChangeRequestStatusChanges"),
  projectContacts: dataStoreReducer<ProjectContactDto[]>("projectContacts"),
  validate: dataStoreReducer<any>("validate"),
  user: dataStoreReducer<{ [key: string]: ProjectRole }>("user"),
  loans: dataStoreReducer<Dtos.LoanDto[]>("loans"),
  loan: dataStoreReducer<Dtos.LoanDto | Dtos.LoanDto>("loan")
});
