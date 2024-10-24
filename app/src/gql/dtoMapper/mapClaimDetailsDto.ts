import type { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { Clock, salesforceDateFormat } from "@framework/util/clock";
import {
  ClaimLineItemAdditionalData,
  ClaimLineItemDtoMapping,
  mapToClaimLineItemDtoArray,
} from "./mapClaimLineItemDto";
import { Claims } from "@framework/constants/recordTypes";
import { equalityIfDefined } from "./equalityIfDefined";

const clock = new Clock();

type ClaimDetailsNode = GQL.PartialNode<{
  Acc_ClaimStatus__c: GQL.Value<string>;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_PeriodCostCategoryTotal__c: GQL.Value<number>;
  Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  Acc_ProjectPeriodStartDate__c?: GQL.Value<string>;
  Acc_Grant_Paid_To_Date__c: GQL.Value<number>;
  Acc_ReasonForDifference__c: GQL.Value<string>;
  Impact_Management_Participation__c: GQL.Value<string>;
  OwnerId: GQL.Value<string>;
  RecordType: GQL.Maybe<{
    DeveloperName: GQL.Value<string>;
  }>;
}>;

type ClaimDetailsDtoMapping = Pick<
  ClaimDetailsDto,
  | "periodId"
  | "costCategoryId"
  | "value"
  | "periodEnd"
  | "periodStart"
  | "impactManagementParticipation"
  | "grantPaidToDate"
  | "isAuthor"
  | "comments"
>;

const mapper: GQL.DtoMapper<
  ClaimDetailsDtoMapping,
  ClaimDetailsNode,
  { currentUser?: { userId?: string; isSystemUser?: boolean } }
> = {
  costCategoryId(node) {
    return (node?.Acc_CostCategory__c?.value ?? "unknown") as CostCategoryId;
  },
  isAuthor(node, additionalData) {
    return (
      additionalData.currentUser?.isSystemUser ||
      (typeof node?.OwnerId?.value === "string" && node?.OwnerId?.value === additionalData.currentUser?.userId)
    );
  },
  comments(node) {
    return node?.Acc_ReasonForDifference__c?.value ?? "";
  },
  periodEnd(node) {
    return clock.parse(node?.Acc_ProjectPeriodEndDate__c?.value ?? null, salesforceDateFormat);
  },
  periodId(node) {
    return (node?.Acc_ProjectPeriodNumber__c?.value ?? 0) as PeriodId;
  },
  periodStart(node) {
    return clock.parse(node?.Acc_ProjectPeriodStartDate__c?.value ?? null, salesforceDateFormat);
  },
  value(node) {
    return node?.Acc_PeriodCostCategoryTotal__c?.value ?? 0;
  },
  impactManagementParticipation(node) {
    return mapImpactManagementParticipationToEnum(node?.Impact_Management_Participation__c?.value);
  },
  grantPaidToDate(node) {
    return node?.Acc_Grant_Paid_To_Date__c?.value ?? 0;
  },
};

type ClaimDetailsAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [["isAuthor", "currentUser", { userId: string; isSystemUser: boolean }]]
>;

/**
 * Maps a specified ClaimDetails Node from a GQL query to a slice of
 * the ClaimDetailsDto to ensure consistency and compatibility in the application
 */
export function mapToClaimDetailsDto<T extends ClaimDetailsNode, PickList extends keyof ClaimDetailsDtoMapping>(
  node: T,
  pickList: PickList[],
  additionalData: ClaimDetailsAdditionalData<PickList>,
): Pick<ClaimDetailsDtoMapping, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<ClaimDetailsDtoMapping, PickList>,
  );
}

/**
 * Maps ClaimDetails Edge to array of ClaimDetails DTOs.
 * It is filtered for correct Record Type of "Claim Detail"
 */
export function mapToClaimDetailsDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ClaimDetailsNode }>> | null,
  PickList extends keyof ClaimDetailsDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  additionalData: ClaimDetailsAdditionalData<PickList>,
): Pick<ClaimDetailsDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(
        x =>
          equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Claims.claimsDetail) &&
          x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
          x?.node?.Acc_CostCategory__c?.value !== null,
      )
      ?.map(node => {
        return mapToClaimDetailsDto(node?.node ?? null, pickList, additionalData);
      }) ?? []
  );
}

/**
 * handler for combined claim details with line items
 */
export function mapToClaimDetailsWithLineItemsDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ClaimDetailsNode }>> | null,
  PickList extends keyof ClaimDetailsDtoMapping,
  ItemsPickList extends keyof ClaimLineItemDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  itemsPickList: ItemsPickList[],
  additionalData: ClaimDetailsAdditionalData<PickList>,
): (Pick<ClaimDetailsDtoMapping, PickList> & {
  lineItems: Pick<ClaimLineItemDtoMapping, ItemsPickList>[];
})[] {
  const claimDetailsEdges =
    edges?.filter(
      x =>
        equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Claims.claimsDetail) &&
        x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
        x?.node?.Acc_CostCategory__c?.value !== null,
    ) || null;

  const claimDetails = mapToClaimDetailsDtoArray(claimDetailsEdges, pickList, additionalData);

  const claimLineItemsEdges =
    edges?.filter(
      x =>
        x?.node?.RecordType?.DeveloperName?.value === Claims.claimsLineItem &&
        x?.node?.Acc_CostCategory__c?.value !== null,
    ) || null;

  const claimLineItems = mapToClaimLineItemDtoArray(
    claimLineItemsEdges,
    itemsPickList,
    additionalData as unknown as ClaimLineItemAdditionalData<ItemsPickList>,
  );

  return claimDetails.map(x => ({ ...x, lineItems: claimLineItems })) as (Pick<ClaimDetailsDtoMapping, PickList> & {
    lineItems: Pick<ClaimLineItemDtoMapping, ItemsPickList>[];
  })[];
}
