import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import type { PartnerDtoGql } from "@framework/dtos";
import { getClaimStatus } from "@framework/mappers/claimStatus";
import { getPartnerStatus } from "@framework/mappers/partnerStatus";
import { calcPercentage } from "@framework/util";

type PartnerNode = Readonly<
  Partial<{
    Id: string;
    Acc_AccountId__c: GQL.Value<string>;
    Acc_AccountId__r: {
      Name: GQL.Value<string>;
      Id?: string | null;
    } | null;
    Acc_AuditReportFrequency__c: GQL.Value<string>;
    Acc_Award_Rate__c: GQL.Value<number>;
    Acc_Cap_Limit__c: GQL.Value<number>;
    Acc_ForecastLastModifiedDate__c: GQL.Value<string>;
    Acc_NewForecastNeeded__c: GQL.Value<boolean>;
    Acc_OpenClaimStatus__c: GQL.Value<string>;
    Acc_OrganisationType__c: GQL.Value<string>;
    Acc_OverheadRate__c: GQL.Value<number>;
    Acc_ProjectRole__c: GQL.Value<string>;
    Acc_ParticipantStatus__c: GQL.Value<string>;
    Acc_RemainingParticipantGrant__c: GQL.Value<number>;
    Acc_TotalApprovedCosts__c: GQL.Value<number>;
    Acc_TotalCostsSubmitted__c: GQL.Value<number>;
    Acc_TotalFutureForecastsForParticipant__c: GQL.Value<number>;
    Acc_TotalGrantApproved__c: GQL.Value<number>;
    Acc_TotalParticipantCosts__c: GQL.Value<number>;
    Acc_TotalPrepayment__c: GQL.Value<number>;
    Acc_TrackingClaims__c: GQL.Value<string>;
  }>
> | null;

type PartnerDtoMapping = Pick<
  PartnerDtoGql,
  | "id"
  | "accountId"
  | "auditReportFrequencyName"
  | "awardRate"
  | "capLimit"
  | "claimStatus"
  | "forecastLastModifiedDate"
  | "forecastsAndCosts"
  | "isLead"
  | "isWithdrawn"
  | "name"
  | "newForecastNeeded"
  | "organisationType"
  | "overheadRate"
  | "partnerStatus"
  | "percentageParticipantCostsClaimed"
  | "percentageParticipantCostsSubmitted"
  | "projectId"
  | "remainingParticipantGrant"
  | "roles"
  | "totalCostsSubmitted"
  | "totalGrantApproved"
  | "totalParticipantCostsClaimed"
  | "totalParticipantGrant"
  | "totalPrepayment"
>;

const mapper: GQL.DtoMapper<PartnerDtoMapping, PartnerNode, { roles: SfRoles }> = {
  id: function (node) {
    return (node?.Id ?? "") as PartnerId;
  },
  accountId: function (node) {
    return node?.Acc_AccountId__c?.value ?? "";
  },
  auditReportFrequencyName(node) {
    return node?.Acc_AuditReportFrequency__c?.value ?? "";
  },
  awardRate(node) {
    return node?.Acc_Award_Rate__c?.value ?? null;
  },
  capLimit(node) {
    return node?.Acc_Cap_Limit__c?.value ?? 0;
  },
  claimStatus: function (node) {
    return getClaimStatus(node?.Acc_TrackingClaims__c?.value ?? "");
  },
  forecastLastModifiedDate: function (node) {
    const dateValue = node?.Acc_ForecastLastModifiedDate__c?.value;
    if (dateValue === null) return null;
    if (dateValue === undefined) return null;
    return new Date(dateValue);
  },
  forecastsAndCosts: function (node) {
    return (
      (node?.Acc_TotalFutureForecastsForParticipant__c?.value ?? 0) + (node?.Acc_TotalCostsSubmitted__c?.value ?? 0)
    );
  },
  isLead: function (node) {
    return node?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead;
  },
  isWithdrawn: function (node) {
    return ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
      node?.Acc_ParticipantStatus__c?.value ?? "",
    );
  },
  name: function (node) {
    return node?.Acc_AccountId__r?.Name?.value ?? "Unknown name";
  },
  newForecastNeeded: function (node) {
    return node?.Acc_NewForecastNeeded__c?.value ?? false;
  },
  organisationType(node) {
    return node?.Acc_OrganisationType__c?.value ?? "unknown";
  },
  overheadRate: function (node) {
    return node?.Acc_OverheadRate__c?.value ?? null;
  },
  partnerStatus: function (node) {
    return getPartnerStatus(node?.Acc_ParticipantStatus__c?.value ?? "unknown");
  },
  percentageParticipantCostsClaimed: function (node) {
    return calcPercentage(node?.Acc_TotalParticipantCosts__c?.value ?? 0, node?.Acc_TotalApprovedCosts__c?.value ?? 0);
  },
  percentageParticipantCostsSubmitted(node) {
    return calcPercentage(node?.Acc_TotalParticipantCosts__c?.value ?? 0, node?.Acc_TotalCostsSubmitted__c?.value ?? 0);
  },
  projectId: function (node) {
    return (node?.Acc_AccountId__r?.Id ?? "") as ProjectId;
  },
  remainingParticipantGrant(node) {
    return node?.Acc_RemainingParticipantGrant__c?.value ?? 0;
  },
  roles: function (node, additionalData: { roles: SfRoles }) {
    return additionalData?.roles ?? { isPm: false, isMo: false, isFc: false };
  },
  totalCostsSubmitted(node) {
    return node?.Acc_TotalCostsSubmitted__c?.value ?? null;
  },
  totalGrantApproved(node) {
    return node?.Acc_TotalGrantApproved__c?.value ?? null;
  },
  totalParticipantCostsClaimed: function (node) {
    return node?.Acc_TotalApprovedCosts__c?.value ?? null;
  },
  totalParticipantGrant: function (node) {
    return node?.Acc_TotalParticipantCosts__c?.value ?? null;
  },
  totalPrepayment(node) {
    return node?.Acc_TotalPrepayment__c?.value ?? null;
  },
};

/**
 * Maps a specified Partner Node from a GQL query to a slice of
 * the PartnerDto to ensure consistency and compatibility in the application
 */
export function mapToPartnerDto<
  T extends PartnerNode,
  PickList extends keyof PartnerDtoMapping,
  AdditionalData extends { roles: SfRoles },
>(projectNode: T, pickList: PickList[], additionalData: AdditionalData): Pick<PartnerDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](projectNode, additionalData);
    return dto;
  }, {} as Pick<PartnerDtoMapping, PickList>);
}

const defaultRole = { isPm: false, isMo: false, isFc: false };

/**
 * Maps Partner Edges to array of Partner DTOs.
 *
 * PartnerRoles object must be supplied as separate argument
 */
export function mapToPartnerDtoArray<
  T extends ReadonlyArray<{ node: PartnerNode } | null> | null,
  PickList extends keyof PartnerDtoMapping,
>(
  partnerEdges: T,
  pickList: PickList[],
  partnerRoles?: PickList extends "roles" ? SfPartnerRoles[] : never,
): Pick<PartnerDtoMapping, PickList>[] {
  return (
    partnerEdges?.map(node => {
      const partnerRole = partnerRoles?.find(x => x?.partnerId === node?.node?.Acc_AccountId__c?.value) ?? defaultRole;
      return mapToPartnerDto(node?.node ?? null, pickList, { roles: partnerRole });
    }) ?? []
  );
}
