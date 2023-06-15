import { ClaimOverrideRateDto } from "@framework/dtos";
import { mapToClaimStatusLabel, mapToClaimStatus, mapClaimStatusValueToLabel } from "@framework/mappers/claimStatus";
import { Clock } from "@framework/util";

const clock = new Clock();

// NAME costCategory type = "Total Cost Category"
// NAME period type = "Total Project Period"

// on Acc_Profile__c
type ClaimOverrideNode = Readonly<Partial<{
  Id: string;
  RecordType: {
    Name: GQL.Value<string>;
  };
  Acc_OverrideAwardRate__c: GQL.Value<number>;
  Acc_CostCategoryName__c: GQL.Value<string>;
  Acc_ProfileOverrideAwardRate__c: GQL.Value<number>;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_CostCategory__r: {
    Acc_CostCategoryName__c: GQL.Value<string>;
  };
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
}> | null> | null;

const mapCostCategoryType: GQL.DtoMapper<ClaimOverrideRateDto, ClaimOverrideNode, {}> = {};

const mapPeriodType: GQL.DtoMapper<ClaimOverrideRateDto, ClaimOverrideNode, {}> = {};

const mapper: GQL.DtoMapper<
  ClaimOverrideRateDto,
  ClaimOverrideNode,
  {
    // roles?: SfRoles;
    // competitionType?: string;
  }
> = {
  //   claimId(node) {
  //     return node?.Acc_Claim__c?.value ?? "unknown";
  //   },
  //   id(node) {
  //     return node?.Id ?? "unknown";
  //   },
  //   comments(node, additionalData) {
  //     const canSeePublic = additionalData?.roles?.isFc || additionalData?.roles?.isPm;
  //     const canSeeHidden = additionalData?.roles?.isMo;
  //     const commentIsPublic = canSeeHidden || (node?.Acc_ParticipantVisibility__c?.value && canSeePublic);
  //     return commentIsPublic ? node?.Acc_ExternalComment__c?.value ?? "" : "";
  //   },
  //   previousStatus(node) {
  //     return mapToClaimStatus(node?.Acc_PreviousClaimStatus__c?.value ?? "unknown");
  //   },
  //   previousStatusLabel(node) {
  //     return node?.Acc_PreviousClaimStatus__c?.value ?? "unknown";
  //   },
  //   newStatus(node) {
  //     return mapToClaimStatus(node?.Acc_NewClaimStatus__c?.value ?? "unknown");
  //   },
  //   newStatusLabel(node, additionalData) {
  //     return mapClaimStatusValueToLabel(
  //       mapToClaimStatusLabel(
  //         this["newStatus"](node, additionalData),
  //         node?.Acc_NewClaimStatus__c?.value ?? "unknown",
  //         additionalData?.competitionType ?? "CR&D",
  //       ),
  //     );
  //   },
  //   createdBy(node) {
  //     return node?.Acc_CreatedByAlias__c?.value ?? "unknown";
  //   },
  //   createdDate(node) {
  //     return node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date(NaN);
  //   },
};

type ClaimOverrideAdditionalData<TPickList extends string> = AdditionalDataType<TPickList, []>;
//   [["comments", "roles", SfRoles], ["newStatusLabel", "competitionType", string]]

/**
 * Maps a specified ClaimOverride Node from a GQL query to
 * the ClaimOverrideDto to ensure consistency and compatibility in the application
 */
export function mapToClaimOverrideDto<T extends ClaimOverrideNode, PickList extends keyof ClaimOverrideRateDto>(
  node: T,
  pickList: PickList[],
  additionalData: ClaimOverrideAdditionalData<PickList>,
): Pick<ClaimOverrideRateDto, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<ClaimOverrideRateDto, PickList>);
}

/**
 * Maps ClaimOverride Edge to array of ClaimOverride DTOs.
 */
export function mapToClaimOverrideDtoArray<
  T extends ReadonlyArray<{ node: ClaimOverrideNode } | null> | null,
  PickList extends keyof ClaimOverrideRateDto,
>(
  edges: T,
  pickList: PickList[],
  additionalData: ClaimOverrideAdditionalData<PickList>,
): Pick<ClaimOverrideRateDto, PickList>[] {
  return (
    edges?.map(node => {
      return mapToClaimOverrideDto(node?.node ?? null, pickList, additionalData);
    }) ?? []
  );
}
