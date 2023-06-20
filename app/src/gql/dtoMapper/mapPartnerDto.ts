import { PartnerStatus, PostcodeTaskStatus } from "@framework/constants/partner";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { getClaimStatus } from "@framework/mappers/claimStatus";
import { getPartnerStatus } from "@framework/mappers/partnerStatus";
import { calcPercentage } from "@framework/util/numberHelper";

/**
 * Note: This field returns a string with an html img element :(
 *
 * We have to parse and validate based on 2 types of src values.
 */
function parseSalesForceWarningFlagUI(flagAsImageString: string): boolean {
  const validFlagsRegex = /\w*ACC_Red_Flag|Acc_ClearImage/;

  const selectedFlag = flagAsImageString.match(validFlagsRegex);

  if (!selectedFlag) {
    throw Error(
      "Could not parse HTML Img src value! The image does not contain the expected flags in validFlagsRegex.",
    );
  }

  const flagImageOptions = new Set(selectedFlag);

  return flagImageOptions.has("ACC_Red_Flag");
}

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
    Acc_NonfundedParticipant__c: GQL.Value<boolean>;
    Acc_OpenClaimStatus__c: GQL.Value<string>;
    Acc_OrganisationType__c: GQL.Value<string>;
    Acc_Overdue_Project__c: GQL.Value<string>;
    Acc_OverheadRate__c: GQL.Value<number>;
    Acc_ParticipantStatus__c: GQL.ValueAndLabel<string>;
    Acc_ParticipantType__c: GQL.Value<string>;
    Acc_Postcode__c: GQL.Value<string>;
    Acc_ProjectRole__c: GQL.Value<string>;
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
  | "competitionName"
  | "forecastLastModifiedDate"
  | "forecastsAndCosts"
  | "isLead"
  | "isNonFunded"
  | "isWithdrawn"
  | "name"
  | "newForecastNeeded"
  | "organisationType"
  | "overdueProject"
  | "overheadRate"
  | "partnerStatus"
  | "partnerStatusLabel"
  | "percentageParticipantCostsClaimed"
  | "percentageParticipantCostsSubmitted"
  | "postcode"
  | "postcodeStatus"
  | "projectId"
  | "remainingParticipantGrant"
  | "roles"
  | "totalCostsSubmitted"
  | "totalGrantApproved"
  | "totalParticipantCostsClaimed"
  | "totalParticipantGrant"
  | "totalPrepayment"
  | "type"
>;

const mapper: GQL.DtoMapper<PartnerDtoMapping, PartnerNode, { roles?: SfRoles; competitionName?: string }> = {
  id(node) {
    return (node?.Id ?? "") as PartnerId;
  },
  accountId(node) {
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
  claimStatus(node) {
    return getClaimStatus(node?.Acc_TrackingClaims__c?.value ?? "");
  },
  competitionName(node, additionalData) {
    return additionalData.competitionName;
  },
  forecastLastModifiedDate(node) {
    const dateValue = node?.Acc_ForecastLastModifiedDate__c?.value;
    if (dateValue === null) return null;
    if (dateValue === undefined) return null;
    return new Date(dateValue);
  },
  forecastsAndCosts(node) {
    return (
      (node?.Acc_TotalFutureForecastsForParticipant__c?.value ?? 0) + (node?.Acc_TotalCostsSubmitted__c?.value ?? 0)
    );
  },
  isLead(node) {
    return node?.Acc_ProjectRole__c?.value === SalesforceProjectRole.ProjectLead;
  },
  isNonFunded(node) {
    return node?.Acc_NonfundedParticipant__c?.value ?? false;
  },
  isWithdrawn(node) {
    return ["Voluntary Withdrawal", "Involuntary Withdrawal", "Migrated - Withdrawn"].includes(
      node?.Acc_ParticipantStatus__c?.value ?? "",
    );
  },
  name(node) {
    return node?.Acc_AccountId__r?.Name?.value ?? "Unknown name";
  },
  newForecastNeeded(node) {
    return node?.Acc_NewForecastNeeded__c?.value ?? false;
  },
  organisationType(node) {
    return node?.Acc_OrganisationType__c?.value ?? "unknown";
  },
  overdueProject(node) {
    const isOverdueProject = parseSalesForceWarningFlagUI(node?.Acc_Overdue_Project__c?.value ?? "");
    return (
      isOverdueProject && getPartnerStatus(node?.Acc_ParticipantStatus__c?.value ?? "unknown") === PartnerStatus.OnHold
    );
  },
  overheadRate(node) {
    return node?.Acc_OverheadRate__c?.value ?? null;
  },
  partnerStatus(node) {
    return getPartnerStatus(node?.Acc_ParticipantStatus__c?.value ?? "unknown");
  },
  partnerStatusLabel(node) {
    return node?.Acc_ParticipantStatus__c?.label ?? "unknown";
  },
  percentageParticipantCostsClaimed(node) {
    return calcPercentage(node?.Acc_TotalParticipantCosts__c?.value ?? 0, node?.Acc_TotalApprovedCosts__c?.value ?? 0);
  },
  percentageParticipantCostsSubmitted(node) {
    return calcPercentage(node?.Acc_TotalParticipantCosts__c?.value ?? 0, node?.Acc_TotalCostsSubmitted__c?.value ?? 0);
  },
  postcode(node) {
    return node?.Acc_Postcode__c?.value ?? null;
  },
  postcodeStatus(node) {
    return node?.Acc_Postcode__c?.value ?? null ? PostcodeTaskStatus.Complete : PostcodeTaskStatus.ToDo; // matches existing logic and not depending on unused Acc_PostcodeStatus__c to limit breaking changes
  },
  projectId(node) {
    return (node?.Acc_AccountId__r?.Id ?? "") as ProjectId;
  },
  remainingParticipantGrant(node) {
    return node?.Acc_RemainingParticipantGrant__c?.value ?? 0;
  },
  roles(node, additionalData: { roles?: SfRoles }) {
    return additionalData?.roles ?? { isPm: false, isMo: false, isFc: false };
  },
  totalCostsSubmitted(node) {
    return node?.Acc_TotalCostsSubmitted__c?.value ?? null;
  },
  totalGrantApproved(node) {
    return node?.Acc_TotalGrantApproved__c?.value ?? null;
  },
  totalParticipantCostsClaimed(node) {
    return node?.Acc_TotalApprovedCosts__c?.value ?? null;
  },
  totalParticipantGrant(node) {
    return node?.Acc_TotalParticipantCosts__c?.value ?? null;
  },
  totalPrepayment(node) {
    return node?.Acc_TotalPrepayment__c?.value ?? null;
  },
  type(node) {
    return node?.Acc_ParticipantType__c?.value ?? "unknown";
  },
};

type PartnerAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [["roles", "roles", SfRoles], ["competitionName", "competitionName", string]]
>;

/**
 * Maps a specified Partner Node from a GQL query to a slice of
 * the PartnerDto to ensure consistency and compatibility in the application
 */
export function mapToPartnerDto<TNode extends PartnerNode, TPickList extends keyof PartnerDtoMapping>(
  projectNode: TNode,
  pickList: TPickList[],
  additionalData: PartnerAdditionalData<TPickList>,
): Pick<PartnerDtoMapping, TPickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](projectNode, additionalData);
    return dto;
  }, {} as Pick<PartnerDtoMapping, TPickList>);
}

const defaultRole = { isPm: false, isMo: false, isFc: false };

/**
 * Maps Partner Edges to array of Partner DTOs.
 *
 * PartnerRoles object must be supplied as separate argument
 */
export function mapToPartnerDtoArray<
  TNode extends ReadonlyArray<{ node: PartnerNode } | null> | null,
  TPickList extends keyof PartnerDtoMapping,
>(
  partnerEdges: TNode,
  pickList: TPickList[],
  additionalData: AdditionalDataType<
    TPickList,
    [
      ["roles", "partnerRoles", SfPartnerRoles[]],
      ["competitionName", "competitionName", string], // get from Acc_Project__c.Acc_CompetitionId__r?.Name
    ]
  >,
): Pick<PartnerDtoMapping, TPickList>[] {
  return (
    partnerEdges?.map(node => {
      if (additionalData && "partnerRoles" in additionalData) {
        const { partnerRoles, ...nextAdditionalData } = additionalData;
        /*
         * find the matching partner roles from the array of passed in roles
         */
        const roles: SfRoles =
          (partnerRoles as SfPartnerRoles[]).find(x => x?.partnerId === node?.node?.Acc_AccountId__c?.value) ??
          defaultRole;

        return mapToPartnerDto(node?.node ?? null, pickList, {
          ...nextAdditionalData,
          roles,
        } as unknown as PartnerAdditionalData<TPickList>);
      }
      return mapToPartnerDto(
        node?.node ?? null,
        pickList,
        additionalData as unknown as PartnerAdditionalData<TPickList>,
      );
    }) ?? []
  );
}
