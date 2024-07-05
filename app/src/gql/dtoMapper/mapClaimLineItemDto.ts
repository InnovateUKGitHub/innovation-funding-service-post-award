import { Claims } from "@framework/constants/recordTypes";
import type { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";

import { Clock } from "@framework/util/clock";

const clock = new Clock();

// on Acc_Claims__c

type ClaimLineItemNode = GQL.PartialNode<{
  Id: string | null;
  Acc_LineItemDescription__c: GQL.Value<string>;
  Acc_LineItemCost__c: GQL.Value<number>;
  Acc_ProjectParticipant__c: GQL.Value<string>;
  Acc_ProjectPeriodNumber__c: GQL.Value<number>;
  Acc_CostCategory__c: GQL.Value<string>;
  LastModifiedDate: GQL.Value<string>;
  Owner: GQL.Maybe<{
    Email?: GQL.Value<string>;
  }>;
  RecordType: GQL.Maybe<{
    DeveloperName: GQL.Value<string>;
  }>;
}>;

export type ClaimLineItemDtoMapping = Pick<
  ClaimLineItemDto,
  "costCategoryId" | "description" | "id" | "lastModifiedDate" | "isAuthor" | "value" | "partnerId" | "periodId"
>;

const mapper: GQL.DtoMapper<
  ClaimLineItemDtoMapping,
  ClaimLineItemNode,
  { currentUser?: { email?: string; isSystemUser?: boolean } }
> = {
  id(node) {
    return node?.Id ?? "unknown id";
  },
  isAuthor(node, additionalData) {
    return (
      additionalData.currentUser?.isSystemUser ||
      (typeof node?.Owner?.Email?.value === "string" && node?.Owner?.Email?.value === additionalData.currentUser?.email)
    );
  },
  costCategoryId(node) {
    return (node?.Acc_CostCategory__c?.value ?? "") as CostCategoryId;
  },
  description(node) {
    return node?.Acc_LineItemDescription__c?.value ?? "";
  },
  lastModifiedDate(node) {
    return !!node?.LastModifiedDate?.value
      ? clock.parseRequiredSalesforceDateTime(node?.LastModifiedDate?.value)
      : new Date(NaN);
  },
  periodId(node) {
    return (node?.Acc_ProjectPeriodNumber__c?.value ?? 0) as PeriodId;
  },
  partnerId(node) {
    return (node?.Acc_ProjectParticipant__c?.value ?? "unknown-partner-id") as PartnerId;
  },
  value(node) {
    return node?.Acc_LineItemCost__c?.value ?? 0;
  },
};

export type ClaimLineItemAdditionalData<TPickList extends string> = AdditionalDataType<
  TPickList,
  [["isAuthor", "currentUser", { email: string; isSystemUser: boolean }]]
>;

/**
 * Maps a specified ClaimLineItem Node from a GQL query to a slice of
 * the ClaimLineItemDto to ensure consistency and compatibility in the application
 */
export function mapToClaimLineItemDto<T extends ClaimLineItemNode, PickList extends keyof ClaimLineItemDtoMapping>(
  node: T,
  pickList: PickList[],
  additionalData: ClaimLineItemAdditionalData<PickList>,
): Pick<ClaimLineItemDtoMapping, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<ClaimLineItemDtoMapping, PickList>,
  );
}

/**
 * Maps ClaimLineItem Edge to array of ClaimLineItem DTOs.
 * It is filtered for correct Record Type of "Claim Detail"
 */
export function mapToClaimLineItemDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: ClaimLineItemNode }>> | null,
  PickList extends keyof ClaimLineItemDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  additionalData: ClaimLineItemAdditionalData<PickList>,
): Pick<ClaimLineItemDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(
        x =>
          x?.node?.RecordType?.DeveloperName?.value === Claims.claimsLineItem &&
          x?.node?.Acc_CostCategory__c?.value !== null,
      )
      ?.map(node => {
        return mapToClaimLineItemDto(node?.node ?? null, pickList, additionalData);
      }) ?? []
  );
}
