import {
  BankCheckStatus,
  BankDetailsTaskStatus,
  PartnerStatus,
  PostcodeTaskStatus,
  SpendProfileStatus,
} from "@framework/constants/partner";
import { SalesforceProjectRole } from "@framework/constants/salesforceProjectRole";
import { PartnerDtoGql } from "@framework/dtos/partnerDto";
import { BankCheckStatusMapper } from "@framework/mappers/bankCheckStatus";
import { BankDetailsTaskStatusMapper } from "@framework/mappers/bankTaskStatus";
import { getClaimStatus } from "@framework/mappers/claimStatus";
import { getPartnerStatus } from "@framework/mappers/partnerStatus";
import { PartnerSpendProfileStatusMapper } from "@framework/mappers/spendProfileStatusMapper";
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

type PartnerNode = GQL.PartialNode<{
  Id: string;
  Acc_AccountId__c: GQL.Value<string>;
  Acc_AccountId__r: GQL.Maybe<{
    Name: GQL.Value<string>;
    Id?: string | null;
  }>;
  Acc_AddressBuildingName__c: GQL.Value<string>;
  Acc_AddressLocality__c: GQL.Value<string>;
  Acc_AccountNumber__c: GQL.Value<string>;
  Acc_AddressPostcode__c: GQL.Value<string>;
  Acc_AddressStreet__c: GQL.Value<string>;
  Acc_AddressTown__c: GQL.Value<string>;
  Acc_AuditReportFrequency__c: GQL.Value<string>;
  Acc_Award_Rate__c: GQL.Value<number>;
  Acc_BankCheckCompleted__c: GQL.ValueAndLabel<string>;
  Acc_BankCheckState__c: GQL.ValueAndLabel<string>;
  Acc_Cap_Limit__c: GQL.Value<number>;
  Acc_CapLimitDeferredAmount__c: GQL.Value<number>;
  Acc_CapLimitDeferredGrant__c: GQL.Value<number>;
  Acc_StaticCapLimitGrant__c: GQL.Value<number>;
  Acc_FirstName__c: GQL.Value<string>;
  Acc_ForecastLastModifiedDate__c: GQL.Value<string>;
  Acc_LastName__c: GQL.Value<string>;
  Acc_NewForecastNeeded__c: GQL.Value<boolean>;
  Acc_NonfundedParticipant__c: GQL.Value<boolean>;
  Acc_Open_Claim_Period__c: GQL.Value<number>;
  Acc_OpenClaimStatus__c: GQL.Value<string>;
  Acc_OrganisationType__c: GQL.Value<string>;
  Acc_Overdue_Project__c: GQL.Value<string>;
  Acc_OverheadRate__c: GQL.Value<number>;
  Acc_ParticipantStatus__c: GQL.ValueAndLabel<string>;
  Acc_ParticipantType__c: GQL.Value<string>;
  Acc_Postcode__c: GQL.Value<string>;
  Acc_ProjectId__c: GQL.Value<string>;
  Acc_ProjectRole__c: GQL.Value<string>;
  Acc_RegistrationNumber__c: GQL.Value<string>;
  Acc_RemainingParticipantGrant__c: GQL.Value<number>;
  Acc_SortCode__c: GQL.Value<string>;
  Acc_SpendProfileCompleted__c: GQL.ValueAndLabel<string>;
  Acc_TotalApprovedCosts__c: GQL.Value<number>;
  Acc_TotalCostsSubmitted__c: GQL.Value<number>;
  Acc_TotalFutureForecastsForParticipant__c: GQL.Value<number>;
  Acc_TotalGrantApproved__c: GQL.Value<number>;
  Acc_TotalParticipantCosts__c: GQL.Value<number>;
  Acc_TotalPrepayment__c: GQL.Value<number>;
  Acc_TrackingClaims__c: GQL.Value<string>;
}>;

type PartnerDtoMapping = Pick<
  PartnerDtoGql,
  | "id"
  | "accountId"
  | "auditReportFrequencyName"
  | "awardRate"
  | "bankCheckStatus"
  | "bankCheckRetryAttempts"
  | "bankDetails"
  | "bankDetailsTaskStatus"
  | "bankDetailsTaskStatusLabel"
  | "capLimit"
  | "capLimitDeferredAmount"
  | "capLimitDeferredGrant"
  | "capLimitGrant"
  | "claimStatus"
  | "competitionName"
  | "forecastLastModifiedDate"
  | "forecastsAndCosts"
  | "isLead"
  | "isNonFunded"
  | "isWithdrawn"
  | "name"
  | "newForecastNeeded"
  | "openClaimPeriodNumber"
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
  | "spendProfileStatus"
  | "spendProfileStatusLabel"
  | "totalCostsSubmitted"
  | "totalFutureForecastsForParticipants"
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
    return node?.Acc_AccountId__c?.value || node?.Acc_AccountId__r?.Id || "";
  },
  auditReportFrequencyName(node) {
    return node?.Acc_AuditReportFrequency__c?.value ?? "";
  },
  awardRate(node) {
    return node?.Acc_Award_Rate__c?.value ?? null;
  },
  bankCheckRetryAttempts() {
    return 0;
  },
  bankCheckStatus(node) {
    const partnerStatus = this["partnerStatus"](node, {}); // requires Acc_ParticipantStatus__c
    return partnerStatus === PartnerStatus.Active
      ? BankCheckStatus.VerificationPassed
      : new BankCheckStatusMapper().mapFromSalesforce(node?.Acc_BankCheckState__c?.value ?? "unknown");
  },
  bankDetails(node) {
    return {
      accountNumber: node?.Acc_AccountNumber__c?.value ?? null,
      address: {
        accountBuilding: node?.Acc_AddressBuildingName__c?.value ?? null,
        accountLocality: node?.Acc_AddressLocality__c?.value ?? null,
        accountPostcode: node?.Acc_AddressPostcode__c?.value ?? null,
        accountStreet: node?.Acc_AddressStreet__c?.value ?? null,
        accountTownOrCity: node?.Acc_AddressTown__c?.value ?? null,
      },
      companyNumber: node?.Acc_RegistrationNumber__c?.value ?? null,
      firstName: node?.Acc_FirstName__c?.value ?? null,
      lastName: node?.Acc_LastName__c?.value ?? null,
      sortCode: node?.Acc_SortCode__c?.value ?? null,
    };
  },
  bankDetailsTaskStatus(node) {
    const partnerStatus = this["partnerStatus"](node, {}); // requires Acc_ParticipantStatus__c
    return partnerStatus === PartnerStatus.Active
      ? BankDetailsTaskStatus.Complete
      : new BankDetailsTaskStatusMapper().mapFromSalesforce(node?.Acc_BankCheckCompleted__c?.value ?? "unknown");
  },
  bankDetailsTaskStatusLabel(node) {
    return node?.Acc_BankCheckCompleted__c?.label ?? "unknown";
  },
  capLimit(node) {
    return node?.Acc_Cap_Limit__c?.value ?? 0;
  },
  capLimitDeferredAmount(node) {
    return node?.Acc_CapLimitDeferredAmount__c?.value ?? 0;
  },
  capLimitDeferredGrant(node) {
    return node?.Acc_CapLimitDeferredGrant__c?.value ?? 0;
  },
  capLimitGrant(node) {
    return node?.Acc_StaticCapLimitGrant__c?.value ?? 0;
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
  openClaimPeriodNumber(node) {
    return node?.Acc_Open_Claim_Period__c?.value ?? 1;
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
    return (node?.Acc_ProjectId__c?.value ?? "") as ProjectId;
  },
  remainingParticipantGrant(node) {
    return node?.Acc_RemainingParticipantGrant__c?.value ?? 0;
  },
  roles(node, additionalData: { roles?: SfRoles }) {
    return additionalData?.roles ?? { isPm: false, isMo: false, isFc: false, isAssociate: false };
  },
  spendProfileStatus(node) {
    const partnerStatus = this["partnerStatus"](node, {}); // requires Acc_ParticipantStatus__c
    return partnerStatus === PartnerStatus.Active
      ? SpendProfileStatus.Complete
      : new PartnerSpendProfileStatusMapper().mapFromSalesforce(node?.Acc_SpendProfileCompleted__c?.value ?? "unknown");
  },
  spendProfileStatusLabel(node) {
    return node?.Acc_SpendProfileCompleted__c?.label ?? "unknown";
  },
  totalCostsSubmitted(node) {
    return node?.Acc_TotalCostsSubmitted__c?.value ?? null;
  },
  totalFutureForecastsForParticipants(node) {
    return node?.Acc_TotalFutureForecastsForParticipant__c?.value ?? null;
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

/**
 * Maps Partner Edges to array of Partner DTOs.
 *
 * PartnerRoles object must be supplied as separate argument
 */
export function mapToPartnerDtoArray<
  TNode extends ReadonlyArray<GQL.Maybe<{ node: PartnerNode }>> | null,
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
        const roles: SfRoles = getPartnerRoles(partnerRoles, node?.node?.Id ?? "unknown");

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

/**
 * utility to fetch correct partner roles
 */
export function getPartnerRoles(roles: SfPartnerRoles[], partnerId: string) {
  return roles.find(x => x.partnerId === partnerId) || ({ isFc: false, isMo: false, isPm: false } as SfPartnerRoles);
}
