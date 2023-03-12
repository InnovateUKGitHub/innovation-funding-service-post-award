import type { ProjectDtoGql } from "@framework/dtos";
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
    Acc_ProjectNumber__c: GQL.Value<string>;
    Acc_ProjectTitle__c: GQL.Value<string>;
    Acc_ProjectStatus__c: GQL.Value<string>;
    Acc_CurrentPeriodNumber__c: GQL.Value<number>;
    Acc_NumberofPeriods__c: GQL.Value<number>;
    Acc_CompetitionType__c: GQL.Value<string>;
    Acc_CurrentPeriodStartDate__c: GQL.Value<string>;
    Acc_CurrentPeriodEndDate__c: GQL.Value<string>;
    Acc_EndDate__c: GQL.Value<string>;
    Acc_GOLTotalCostAwarded__c: GQL.Value<number>;
    Acc_TotalProjectCosts__c: GQL.Value<number>;
    Acc_PCRsForReview__c: GQL.Value<number>;
    Acc_PCRsUnderQuery__c: GQL.Value<number>;
    Acc_ClaimsForReview__c: GQL.Value<number>;
  }>
> | null;

type ProjectDtoMapping = Pick<
  ProjectDtoGql,
  | "id"
  | "claimedPercentage"
  | "claimsToReview"
  | "competitionType"
  | "costsClaimedToDate"
  | "isActive"
  | "isPastEndDate"
  | "grantOfferLetterCosts"
  | "numberOfPeriods"
  | "pcrsQueried"
  | "pcrsToReview"
  | "periodEndDate"
  | "periodId"
  | "periodStartDate"
  | "projectNumber"
  | "roles"
  | "status"
  | "title"
>;

const mapper: GQL.DtoMapper<ProjectDtoMapping, ProjectNode> = {
  id: function (node) {
    return node?.Id ?? "";
  },
  claimedPercentage: function (node) {
    return !!node?.Acc_GOLTotalCostAwarded__c?.value
      ? roundCurrency((100 * (node?.Acc_TotalProjectCosts__c?.value ?? 0)) / node?.Acc_GOLTotalCostAwarded__c?.value)
      : null;
  },
  claimsToReview: function (node) {
    return node?.Acc_ClaimsForReview__c?.value ?? 0;
  },
  competitionType: function (node) {
    return node?.Acc_CompetitionType__c?.value ?? "Unknown";
  },
  costsClaimedToDate: function (node) {
    return node?.Acc_TotalProjectCosts__c?.value ?? 0;
  },
  isActive: function (node) {
    return !!node?.isActive;
  },
  isPastEndDate: function (node) {
    return dayComparator(clock.parseOptionalSalesforceDate(node?.Acc_EndDate__c?.value ?? "") as Date, new Date()) < 0;
  },
  grantOfferLetterCosts: function (node) {
    return node?.Acc_GOLTotalCostAwarded__c?.value ?? 0;
  },
  numberOfPeriods: function (node) {
    return Number(node?.Acc_NumberofPeriods__c?.value ?? 0);
  },
  pcrsQueried: function (node) {
    return node?.Acc_PCRsUnderQuery__c?.value ?? 0;
  },
  pcrsToReview: function (node) {
    return node?.Acc_PCRsForReview__c?.value ?? 0;
  },
  periodEndDate: function (node) {
    return !!node?.Acc_CurrentPeriodEndDate__c?.value ? new Date(node?.Acc_CurrentPeriodEndDate__c?.value) : null;
  },
  periodId: function (node) {
    return node?.Acc_CurrentPeriodNumber__c?.value ?? 0;
  },
  periodStartDate: function (node) {
    return !!node?.Acc_CurrentPeriodStartDate__c?.value ? new Date(node?.Acc_CurrentPeriodStartDate__c?.value) : null;
  },
  projectNumber: function (node) {
    return node?.Acc_ProjectNumber__c?.value ?? "";
  },
  roles: function (node) {
    return {
      isPm: node?.roles?.isPm ?? false,
      isMo: node?.roles?.isMo ?? false,
      isFc: node?.roles?.isFc ?? false,
    };
  },
  status: function (node) {
    return getProjectStatus(node?.Acc_ProjectStatus__c?.value ?? "Unknown");
  },
  title: function (node) {
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
