import { ClaimFrequency } from "@framework/constants/enums";
import { ProjectSource, TypeOfAid } from "@framework/constants/project";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { getMonitoringLevel } from "@framework/mappers/projectMonitoringLevel";
import { getProjectStatus } from "@framework/mappers/projectStatus";
import { Clock } from "@framework/util/clock";
import { dayComparator } from "@framework/util/comparator";
import { roundCurrency } from "@framework/util/numberHelper";

const clock = new Clock();

const mapTypeOfAidToEnum = (typeOfAid: string): TypeOfAid => {
  switch (typeOfAid) {
    case "State aid":
      return TypeOfAid.StateAid;
    case "De minimis aid":
      return TypeOfAid.DeMinimisAid;
    default:
      return TypeOfAid.Unknown;
  }
};

const mapClaimFrequencyToEnum = (freq: string): ClaimFrequency => {
  switch (freq) {
    case "Quarterly":
      return ClaimFrequency.Quarterly;
    case "Monthly":
      return ClaimFrequency.Monthly;
    default:
      return ClaimFrequency.Unknown;
  }
};

type ProjectNode = GQL.PartialNode<{
  Id: string;
  roles: SfRoles & {
    isSalesforceSystemUser?: boolean | null;
    partnerRoles?: ReadonlyArray<SfRoles & { partnerId: string }>;
  };
  isActive: boolean;
  Acc_ClaimFrequency__c: GQL.Value<string>;
  Acc_ClaimsForReview__c: GQL.Value<number>;
  Acc_ClaimsOverdue__c: GQL.Value<number>;
  Acc_ClaimsUnderQuery__c: GQL.Value<number>;
  Acc_CompetitionType__c: GQL.Value<string>;
  Acc_CompetitionId__r: GQL.Maybe<{
    Name?: GQL.Value<string>;
    Acc_TypeofAid__c?: GQL.Value<string>;
  }>;
  Acc_CurrentPeriodEndDate__c: GQL.Value<string>;
  Acc_CurrentPeriodNumber__c: GQL.Value<number>;
  Acc_CurrentPeriodStartDate__c: GQL.Value<string>;
  Acc_Duration__c: GQL.Value<number>;
  Acc_EndDate__c: GQL.Value<string>;
  Acc_GOLTotalCostAwarded__c: GQL.Value<number>;
  Acc_LeadParticipantID__c: GQL.Value<string>;
  Acc_LeadParticipantName__c: GQL.Value<string>;
  Acc_NonFEC__c: GQL.Value<boolean>;
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
  Impact_Management_Participation__c: GQL.Value<string>;
  Acc_ProjectSource__c: GQL.Value<string>;
}>;

type ProjectDtoMapping = Pick<
  ProjectDtoGql,
  | "id"
  | "claimFrequency"
  | "claimFrequencyName"
  | "claimedPercentage"
  | "claimsOverdue"
  | "claimsToReview"
  | "claimsWithParticipant"
  | "competitionName"
  | "competitionType"
  | "costsClaimedToDate"
  | "durationInMonths"
  | "endDate"
  | "isActive"
  | "isNonFec"
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
  | "typeOfAid"
  | "partnerRoles"
  | "impactManagementParticipation"
  | "projectSource"
>;

const mapper: GQL.DtoMapper<ProjectDtoMapping, ProjectNode> = {
  id(node) {
    return (node?.Id ?? "") as ProjectId;
  },
  claimFrequency(node) {
    return mapClaimFrequencyToEnum(node?.Acc_ClaimFrequency__c?.value ?? "unknown");
  },
  claimFrequencyName(node) {
    return node?.Acc_ClaimFrequency__c?.value ?? "Unknown";
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
  claimsWithParticipant(node) {
    return node?.Acc_ClaimsUnderQuery__c?.value ?? 0;
  },
  competitionName(node) {
    return node?.Acc_CompetitionId__r?.Name?.value ?? "unknown competition name";
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
  impactManagementParticipation(node) {
    return mapImpactManagementParticipationToEnum(node?.Impact_Management_Participation__c?.value);
  },
  isActive(node) {
    return !!node?.isActive;
  },
  isNonFec(node) {
    return !!node?.Acc_NonFEC__c?.value;
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
    const periodId = node?.Acc_CurrentPeriodNumber__c?.value;

    if (typeof periodId !== "number") return 0 as PeriodId;
    if (typeof periodId === "number" && periodId < 0) return 0 as PeriodId;

    return periodId as PeriodId;
  },
  periodStartDate(node) {
    return !!node?.Acc_CurrentPeriodStartDate__c?.value ? new Date(node?.Acc_CurrentPeriodStartDate__c?.value) : null;
  },
  projectNumber(node) {
    return node?.Acc_ProjectNumber__c?.value ?? "";
  },
  projectSource(node) {
    return (node?.Acc_ProjectSource__c?.value as ProjectSource) ?? ProjectSource.Unknown;
  },
  roles(node) {
    return {
      isPm: node?.roles?.isPm ?? false,
      isMo: node?.roles?.isMo ?? false,
      isFc: node?.roles?.isFc ?? false,
      isAssociate: node?.roles?.isAssociate ?? false,
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
  typeOfAid(node) {
    return mapTypeOfAidToEnum(node?.Acc_CompetitionId__r?.Acc_TypeofAid__c?.value ?? "unknown");
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
