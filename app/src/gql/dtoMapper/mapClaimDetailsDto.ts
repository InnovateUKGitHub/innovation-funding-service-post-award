import type { ClaimDetailsDto } from "@framework/dtos";
import { Clock, salesforceDateFormat } from "@framework/util";

const clock = new Clock();

type ClaimDetailsNode = Readonly<
  Partial<{
    Acc_CostCategory__c: GQL.Value<string>;
    Acc_ProjectPeriodStartDate__c?: GQL.Value<string>;
    Acc_ProjectPeriodEndDate__c: GQL.Value<string>;
    Acc_ProjectPeriodNumber__c: GQL.Value<number>;
    Acc_PeriodCostCategoryTotal__c: GQL.Value<number>;
    Acc_ClaimStatus__c: GQL.Value<string>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type ClaimDetailsDtoMapping = Pick<
  ClaimDetailsDto,
  "periodId" | "costCategoryId" | "value" | "periodEnd" | "periodStart"
>;

const mapper: GQL.DtoMapper<ClaimDetailsDtoMapping, ClaimDetailsNode> = {
  costCategoryId: function (node) {
    return node?.Acc_CostCategory__c?.value ?? "unknown";
  },
  periodId: function (node) {
    return node?.Acc_ProjectPeriodNumber__c?.value ?? 0;
  },
  periodStart: function (node) {
    return clock.parse(node?.Acc_ProjectPeriodStartDate__c?.value ?? null, salesforceDateFormat);
  },
  periodEnd: function (node) {
    return clock.parse(node?.Acc_ProjectPeriodEndDate__c?.value ?? null, salesforceDateFormat);
  },
  value: function (node) {
    return node?.Acc_PeriodCostCategoryTotal__c?.value ?? 0;
  },
};

/**
 * Maps a specified ClaimDetails Node from a GQL query to a slice of
 * the ClaimDetailsDto to ensure consistency and compatibility in the application
 */
export function mapToClaimDetailsDto<T extends ClaimDetailsNode, PickList extends keyof ClaimDetailsDtoMapping>(
  node: T,
  pickList: PickList[],
): Pick<ClaimDetailsDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<ClaimDetailsDtoMapping, PickList>);
}

/**
 * Maps ClaimDetails Edge to array of ClaimDetails DTOs.
 * It is filtered for correct Record Type of "Claim Detail"
 */
export function mapToClaimDetailsDtoArray<
  T extends ReadonlyArray<{ node: ClaimDetailsNode } | null> | null,
  PickList extends keyof ClaimDetailsDtoMapping,
>(edges: T, pickList: PickList[]): Pick<ClaimDetailsDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(
        x =>
          x?.node?.RecordType?.Name?.value === "Claims Detail" &&
          x?.node?.Acc_ClaimStatus__c?.value !== "New" &&
          x?.node?.Acc_CostCategory__c?.value !== null,
      )
      ?.map(node => {
        return mapToClaimDetailsDto(node?.node ?? null, pickList);
      }) ?? []
  );
}
