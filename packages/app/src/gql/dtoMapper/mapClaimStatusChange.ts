import { ClaimStatusChangeDto } from "@framework/dtos/claimDto";
import { mapToClaimStatusLabel, mapToClaimStatus, mapClaimStatusValueToLabel } from "@framework/mappers/claimStatus";
import { Clock } from "@framework/util/clock";

const clock = new Clock();

// on Acc_StatusChange__c
type ClaimStatusChangeNode = GQL.PartialNode<{
  Id: string;
  Acc_Claim__c: GQL.Value<string>;
  Acc_PreviousClaimStatus__c: GQL.Value<string>;
  Acc_NewClaimStatus__c: GQL.Value<string>;
  Acc_ExternalComment__c: GQL.Value<string>;
  Acc_ParticipantVisibility__c: GQL.Value<boolean>;
  Acc_CreatedByAlias__c: GQL.Value<string>;
  CreatedDate: GQL.Value<string>;
}>;

const mapper: GQL.DtoMapper<
  ClaimStatusChangeDto,
  ClaimStatusChangeNode,
  {
    roles?: SfRoles;
    competitionType?: string;
  }
> = {
  claimId(node) {
    return node?.Acc_Claim__c?.value ?? "unknown";
  },
  id(node) {
    return node?.Id ?? "unknown";
  },
  comments(node, additionalData) {
    const canSeePublic = additionalData?.roles?.isFc || additionalData?.roles?.isPm;
    const canSeeHidden = additionalData?.roles?.isMo;
    const commentIsPublic = canSeeHidden || (node?.Acc_ParticipantVisibility__c?.value && canSeePublic);
    return commentIsPublic ? node?.Acc_ExternalComment__c?.value ?? "" : "";
  },
  previousStatus(node) {
    return mapToClaimStatus(node?.Acc_PreviousClaimStatus__c?.value ?? "unknown");
  },
  previousStatusLabel(node) {
    return node?.Acc_PreviousClaimStatus__c?.value ?? "unknown";
  },
  newStatus(node) {
    return mapToClaimStatus(node?.Acc_NewClaimStatus__c?.value ?? "unknown");
  },
  newStatusLabel(node, additionalData) {
    return mapClaimStatusValueToLabel(
      mapToClaimStatusLabel(
        this["newStatus"](node, additionalData),
        node?.Acc_NewClaimStatus__c?.value ?? "unknown",
        additionalData?.competitionType ?? "CR&D",
      ),
    );
  },
  createdBy(node) {
    return node?.Acc_CreatedByAlias__c?.value ?? "unknown";
  },
  createdDate(node) {
    return node?.CreatedDate?.value ? clock.parseRequiredSalesforceDateTime(node?.CreatedDate?.value) : new Date(NaN);
  },
};

type ClaimStatusChangeAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [["comments", "roles", SfRoles], ["newStatusLabel", "competitionType", string]]
>;

/**
 * Maps a specified ClaimStatusChange Node from a GQL query to
 * the ClaimStatusChangeDto to ensure consistency and compatibility in the application
 */
export function mapToClaimStatusChangeDto<T extends ClaimStatusChangeNode, PickList extends keyof ClaimStatusChangeDto>(
  node: T,
  pickList: PickList[],
  additionalData: ClaimStatusChangeAdditionalData<PickList>,
): Pick<ClaimStatusChangeDto, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<ClaimStatusChangeDto, PickList>,
  );
}

/**
 * Maps ClaimStatusChanged Edge to array of ClaimStatusChange DTOs.
 */
export function mapToClaimStatusChangeDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ClaimStatusChangeNode }>> | null,
  PickList extends keyof ClaimStatusChangeDto,
>(
  edges: T,
  pickList: PickList[],
  additionalData: ClaimStatusChangeAdditionalData<PickList>,
): Pick<ClaimStatusChangeDto, PickList>[] {
  return (
    edges?.map(node => {
      return mapToClaimStatusChangeDto(node?.node ?? null, pickList, additionalData);
    }) ?? []
  );
}
