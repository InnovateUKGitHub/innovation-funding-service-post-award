import type { ProjectDtoGql } from "@framework/dtos";
import { getMonitoringLevel } from "@framework/mappers/projectMonitoringLevel";
import { getProjectStatus } from "@framework/mappers/projectStatus";
import { Clock, dayComparator, roundCurrency } from "@framework/util";

const clock = new Clock();

type ProjectNode = Readonly<
  Partial<{
    Id: string;
    roles: SfRoles & {
      isSalesforceSystemUser?: boolean | null;
      partnerRoles?: ReadonlyArray<SfRoles & { partnerId: string }>;
    };
    isActive: boolean;
    Acc_ClaimsForReview__c: GQL.Value<number>;
    Acc_ClaimsOverdue__c: GQL.Value<number>;
    Acc_CompetitionType__c: GQL.Value<string>;
    Acc_CurrentPeriodEndDate__c: GQL.Value<string>;
    Acc_CurrentPeriodNumber__c: GQL.Value<number>;
    Acc_CurrentPeriodStartDate__c: GQL.Value<string>;
    Acc_Duration__c: GQL.Value<number>;
    Acc_EndDate__c: GQL.Value<string>;
    Acc_GOLTotalCostAwarded__c: GQL.Value<number>;
    Acc_LeadParticipantID__c: GQL.Value<string>;
    Acc_LeadParticipantName__c: GQL.Value<string>;
    Acc_NumberOfOpenClaims__c: GQL.Value<number>;
    Acc_NumberofPeriods__c: GQL.Value<number>;
    Acc_PCRsForReview__c: GQL.Value<number>;
    Acc_PCRsUnderQuery__c: GQL.Value<number>;
    Acc_ProjectNumber__c: GQL.Value<string>;
    Acc_ProjectStatus__c: GQL.ValueAndLabel<string>;
    Acc_ProjectSummary__c: GQL.Value<string>;
    Acc_ProjectTitle__c: GQL.Value<string>;
    Acc_StartDate__c: GQL.Value<string>;
    Acc_TotalProjectCosts__c: GQL.Value<number>;
    Acc_MonitoringLevel__c: GQL.Value<string>;
    Loan_LoanAvailabilityPeriodLength__c: GQL.Value<number>;
    Loan_LoanEndDate__c: GQL.Value<string>;
    Loan_LoanExtensionPeriodLength__c: GQL.Value<number>;
    Loan_LoanRepaymentPeriodLength__c: GQL.Value<number>;
  }>
> | null;

type ProjectDtoMapping = Pick<
  ProjectDtoGql,
  | "id"
  | "claimedPercentage"
  | "claimsOverdue"
  | "claimsToReview"
  | "competitionType"
  | "costsClaimedToDate"
  | "durationInMonths"
  | "endDate"
  | "isActive"
  | "isPastEndDate"
  | "grantOfferLetterCosts"
  | "leadPartnerName"
  | "leadPartnerId"
  | "loanAvailabilityPeriodLength"
  | "loanEndDate"
  | "loanExtensionPeriodLength"
  | "loanRepaymentPeriodLength"
  | "monitoringLevel"
  | "numberOfOpenClaims"
  | "numberOfPeriods"
  | "pcrsQueried"
  | "pcrsToReview"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "projectNumber"
  | "roles"
  | "startDate"
  | "status"
  | "statusName"
  | "summary"
  | "title"
  | "partnerRoles"
>;

const mapper: GQL.DtoMapper<ProjectDtoMapping, ProjectNode> = {
  id(node) {
    return (node?.Id ?? "") as ProjectId;
  },
  claimedPercentage(node) {
    return !!node?.Acc_GOLTotalCostAwarded__c?.value
      ? roundCurrency((100 * (node?.Acc_TotalProjectCosts__c?.value ?? 0)) / node?.Acc_GOLTotalCostAwarded__c?.value)
      : null;
  },
  claimsOverdue(node) {
    return node?.Acc_ClaimsOverdue__c?.value ?? 0;
  },
  claimsToReview(node) {
    return node?.Acc_ClaimsForReview__c?.value ?? 0;
  },
  competitionType(node) {
    return node?.Acc_CompetitionType__c?.value ?? "Unknown";
  },
  costsClaimedToDate(node) {
    return node?.Acc_TotalProjectCosts__c?.value ?? 0;
  },
  durationInMonths(node) {
    return node?.Acc_Duration__c?.value ?? 0;
  },
  endDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_EndDate__c?.value ?? null) as Date;
  },
  isActive(node) {
    return !!node?.isActive;
  },
  isPastEndDate(node) {
    return dayComparator(clock.parseOptionalSalesforceDate(node?.Acc_EndDate__c?.value ?? "") as Date, new Date()) < 0;
  },
  grantOfferLetterCosts(node) {
    return node?.Acc_GOLTotalCostAwarded__c?.value ?? 0;
  },
  leadPartnerId(node) {
    return node?.Acc_LeadParticipantID__c?.value ?? "unknown_lead_partner_id";
  },
  leadPartnerName(node) {
    return node?.Acc_LeadParticipantName__c?.value ?? "";
  },
  loanAvailabilityPeriodLength(node) {
    return node?.Loan_LoanAvailabilityPeriodLength__c?.value ?? null;
  },
  loanEndDate(node) {
    return !!node?.Loan_LoanEndDate__c?.value ? new Date(node?.Loan_LoanEndDate__c?.value) : null;
  },
  loanExtensionPeriodLength(node) {
    return node?.Loan_LoanExtensionPeriodLength__c?.value ?? null;
  },
  loanRepaymentPeriodLength(node) {
    return node?.Loan_LoanRepaymentPeriodLength__c?.value ?? null;
  },
  monitoringLevel(node) {
    return getMonitoringLevel(node?.Acc_MonitoringLevel__c?.value);
  },
  numberOfOpenClaims(node) {
    return node?.Acc_NumberOfOpenClaims__c?.value ?? 0;
  },
  numberOfPeriods(node) {
    return Number(node?.Acc_NumberofPeriods__c?.value ?? 0);
  },
  partnerRoles(node) {
    return (node?.roles?.partnerRoles ?? []) as Mutable<SfPartnerRoles>[];
  },
  pcrsQueried(node) {
    return node?.Acc_PCRsUnderQuery__c?.value ?? 0;
  },
  pcrsToReview(node) {
    return node?.Acc_PCRsForReview__c?.value ?? 0;
  },
  periodEndDate(node) {
    return !!node?.Acc_CurrentPeriodEndDate__c?.value ? new Date(node?.Acc_CurrentPeriodEndDate__c?.value) : null;
  },
  periodId(node) {
    return node?.Acc_CurrentPeriodNumber__c?.value ?? -1;
  },
  periodStartDate(node) {
    return !!node?.Acc_CurrentPeriodStartDate__c?.value ? new Date(node?.Acc_CurrentPeriodStartDate__c?.value) : null;
  },
  projectNumber(node) {
    return node?.Acc_ProjectNumber__c?.value ?? "";
  },
  roles(node) {
    return {
      isPm: node?.roles?.isPm ?? false,
      isMo: node?.roles?.isMo ?? false,
      isFc: node?.roles?.isFc ?? false,
    };
  },
  startDate(node) {
    return clock.parseOptionalSalesforceDate(node?.Acc_StartDate__c?.value ?? null);
  },
  status(node) {
    return getProjectStatus(node?.Acc_ProjectStatus__c?.value);
  },
  statusName(node) {
    return node?.Acc_ProjectStatus__c?.label ?? "Unknown";
  },
  summary(node) {
    return node?.Acc_ProjectSummary__c?.value ?? "";
  },
  title(node) {
    return node?.Acc_ProjectTitle__c?.value ?? "";
  },
};

/**
 * Maps a specified Project Node from a GQL query to a slice of
 * the ProjectDto to ensure consistency and compatibility in the application
 */
export function mapToProjectDto<T extends ProjectNode, PickList extends keyof ProjectDtoMapping>(
  node: T,
  pickList: PickList[],
): Pick<ProjectDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<ProjectDtoMapping, PickList>);
}
