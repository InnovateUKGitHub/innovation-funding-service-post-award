import { TotalCosts } from "@framework/constants/claims";
import { LoadingStatus } from "@framework/constants/enums";
import {
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRSpendProfileCapitalUsageType,
  PCRSpendProfileOverheadRate,
} from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { AccountDto } from "@framework/dtos/accountDto";
import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { ClaimDetailsDto, ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto, ClaimStatusChangeDto } from "@framework/dtos/claimDto";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CompanyDto } from "@framework/dtos/companyDto";
import { IContact } from "@framework/dtos/contact";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { DeveloperUser } from "@framework/dtos/developerUser";
import { AllPartnerDocumentSummaryDto, DocumentSummaryDto } from "@framework/dtos/documentDto";
import { FinancialLoanVirementDto, FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { LoanDto } from "@framework/dtos/loanDto";
import {
  MonitoringReportDto,
  MonitoringReportQuestionDto,
  MonitoringReportStatusChangeDto,
  MonitoringReportSummaryDto,
} from "@framework/dtos/monitoringReportDto";
import { Option } from "@framework/dtos/option";
import { PartnerDto } from "@framework/dtos/partnerDto";
import {
  PCRDto,
  PCRItemTypeDto,
  PCRSummaryDto,
  PCRTimeExtensionOption,
  ProjectChangeRequestStatusChangeDto,
} from "@framework/dtos/pcrDtos";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { IAppError } from "@framework/types/IAppError";
import { combineReducers } from "redux";
import { DataLoadAction } from "../actions/common/dataLoad";
import { TransitionActions } from "../actions/common/transitionActions";

export interface IDataStore<T> {
  status: LoadingStatus;
  data: T;
  error: IAppError | null;
}

const dataStoreReducer =
  <TData extends AnyObject>(storeKey: string) =>
  (state: { [key: string]: IDataStore<TData> } = {}, action: DataLoadAction | TransitionActions) => {
    if (action.type === "DATA_LOAD" && action.payload?.store === storeKey) {
      const existing = state[action.payload.id];
      const err = action.payload.error || null;

      const pending: IDataStore<TData> = {
        status: action.payload.status,
        data: action.payload.data || (existing && existing.data),
        error: err && { code: err.code, message: err.message, results: err.results, details: err.details },
      };

      return Object.assign({}, state, { [action.payload.id]: pending });
    }

    if (action.type === "ROUTE_TRANSITION" && action.payload !== "REPLACE") {
      const result = Object.assign({}, state);
      Object.keys(result).forEach(itemKey => {
        const pending = result[itemKey];
        if (
          pending.status === LoadingStatus.Done ||
          pending.status === LoadingStatus.Failed ||
          pending.status === LoadingStatus.Updated
        ) {
          result[itemKey] = { status: LoadingStatus.Stale, data: pending.data, error: pending.error };
        }
      });
      return result;
    }

    return state;
  };

const reducers = {
  jesOnlyAccounts: dataStoreReducer<AccountDto[]>("jesOnlyAccounts"),
  broadcasts: dataStoreReducer<BroadcastDto[]>("broadcasts"),
  broadcast: dataStoreReducer<BroadcastDto>("broadcast"),
  claims: dataStoreReducer<ClaimDto[]>("claims"),
  claim: dataStoreReducer<ClaimDto>("claim"),
  claimOverrides: dataStoreReducer<ClaimOverrideRateDto>("claimOverrides"),
  allClaimsIncludingNew: dataStoreReducer<ClaimDto[]>("allClaimsIncludingNew"),
  claimTotalCosts: dataStoreReducer<TotalCosts>("claimTotalCosts"),
  claimDetail: dataStoreReducer<ClaimDetailsDto>("claimDetail"),
  claimDetails: dataStoreReducer<ClaimDetailsSummaryDto[]>("claimDetails"),
  claimStatusChanges: dataStoreReducer<ClaimStatusChangeDto[]>("claimStatusChanges"),
  companies: dataStoreReducer<CompanyDto[]>("companies"),
  costsSummary: dataStoreReducer<CostsSummaryForPeriodDto[]>("costsSummary"),
  costCategories: dataStoreReducer<CostCategoryDto[]>("costCategories"),
  contacts: dataStoreReducer<IContact[]>("contacts"),
  developerUsers: dataStoreReducer<DeveloperUser[]>("developerUsers"),
  documents: dataStoreReducer<DocumentSummaryDto[]>("documents"),
  financialVirement: dataStoreReducer<FinancialVirementDto>("financialVirement"),
  financialLoanVirement: dataStoreReducer<FinancialLoanVirementDto>("financialLoanVirement"),
  forecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("forecastDetails"),
  initialForecastDetails: dataStoreReducer<ForecastDetailsDTO[]>("initialForecastDetails"),
  forecastDetail: dataStoreReducer<ForecastDetailsDTO>("forecastDetail"),
  forecastGolCosts: dataStoreReducer<GOLCostDto[]>("forecastGolCosts"),
  monitoringReport: dataStoreReducer<MonitoringReportDto>("monitoringReport"),
  monitoringReports: dataStoreReducer<MonitoringReportSummaryDto[]>("monitoringReports"),
  monitoringReportQuestions: dataStoreReducer<MonitoringReportQuestionDto[]>("monitoringReportQuestions"),
  monitoringReportStatusChanges: dataStoreReducer<MonitoringReportStatusChangeDto[]>("monitoringReportStatusChanges"),
  partner: dataStoreReducer<PartnerDto>("partner"),
  partnerDocuments: dataStoreReducer<AllPartnerDocumentSummaryDto>("partnerDocuments"),
  partners: dataStoreReducer<PartnerDto[]>("partners"),
  pcrs: dataStoreReducer<PCRSummaryDto[]>("pcrs"),
  pcr: dataStoreReducer<PCRDto>("pcr"),
  pcrTypes: dataStoreReducer<PCRItemTypeDto[]>("pcrTypes"),
  pcrAvailableTypes: dataStoreReducer<PCRItemTypeDto[]>("pcrAvailableTypes"),
  pcrTimeExtensionOptions: dataStoreReducer<PCRTimeExtensionOption[]>("pcrTimeExtensionOptions"),
  pcrParticipantSizes: dataStoreReducer<Option<PCRParticipantSize>[]>("pcrParticipantSizes"),
  pcrProjectLocations: dataStoreReducer<Option<PCRProjectLocation>[]>("pcrProjectLocations"),
  pcrProjectRoles: dataStoreReducer<Option<PCRProjectRole>[]>("pcrProjectRoles"),
  pcrPartnerTypes: dataStoreReducer<Option<PCRPartnerType>[]>("pcrPartnerTypes"),
  pcrSpendProfileCapitalUsageTypes: dataStoreReducer<Option<PCRSpendProfileCapitalUsageType>[]>(
    "pcrSpendProfileCapitalUsageTypes",
  ),
  pcrSpendProfileOverheadRateOptions: dataStoreReducer<Option<PCRSpendProfileOverheadRate>[]>(
    "pcrSpendProfileOverheadRateOptions",
  ),
  projectRole: dataStoreReducer<AnyObject>("projectRole"),
  project: dataStoreReducer<ProjectDto>("project"),
  projects: dataStoreReducer<ProjectDto[]>("projects"),
  projectChangeRequestStatusChanges: dataStoreReducer<ProjectChangeRequestStatusChangeDto[]>(
    "projectChangeRequestStatusChanges",
  ),
  projectContacts: dataStoreReducer<ProjectContactDto[]>("projectContacts"),
  validate: dataStoreReducer<AnyObject>("validate"),
  user: dataStoreReducer<{ [key: string]: ProjectRole }>("user"),
  loans: dataStoreReducer<LoanDto[]>("loans"),
  loan: dataStoreReducer<LoanDto | LoanDto>("loan"),
};

export type DataStateKeys = keyof typeof reducers;

export const dataReducer = combineReducers(reducers);
