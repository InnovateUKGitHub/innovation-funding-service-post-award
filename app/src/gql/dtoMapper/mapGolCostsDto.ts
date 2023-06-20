import { GOLCostDto } from "@framework/dtos/golCostDto";

type GolCostNode = Readonly<
  Partial<{
    Id: string;
    Acc_CostCategory__c: GQL.Value<string>;
    Acc_CostCategoryGOLCost__c: GQL.Value<number>;
    RecordType: {
      Name: GQL.Value<string>;
    } | null;
  }>
> | null;

type GolCostDtoMapping = Pick<GOLCostDto, "costCategoryId" | "costCategoryName" | "value">;

const mapper: GQL.DtoMapper<GolCostDtoMapping, GolCostNode, { costCategories: { id: string; name: string }[] }> = {
  costCategoryId: function (node) {
    return node?.Acc_CostCategory__c?.value ?? "unknown category";
  },
  costCategoryName: function (node, additionalData) {
    return additionalData.costCategories
      .filter(costCategory => costCategory.id === node?.Acc_CostCategory__c?.value)
      .map(costCategory => costCategory.name)[0];
  },
  value: function (node) {
    return node?.Acc_CostCategoryGOLCost__c?.value ?? 0;
  },
};

/**
 * Maps a specified GolCost Node from a GQL query to a slice of
 * the GolCostDto to ensure consistency and compatibility in the application
 */
export function mapToGolCostDto<
  T extends GolCostNode,
  PickList extends keyof GolCostDtoMapping,
  AdditionalData extends { costCategories: { id: string; name: string }[] },
>(node: T, pickList: PickList[], additionalData: AdditionalData): Pick<GolCostDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<GolCostDtoMapping, PickList>);
}

/**
 * Maps GolCost Edge to array of GolCost DTOs.
 *
 * includes filter to make sure only correct record types included
 *
 * requires cost categories array to be passed in
 */
export function mapToGolCostDtoArray<
  T extends ReadonlyArray<{ node: GolCostNode } | null> | null,
  PickList extends keyof GolCostDtoMapping,
>(edges: T, pickList: PickList[], costCategories: { id: string; name: string }[]): Pick<GolCostDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(x => x?.node?.RecordType?.Name?.value === "Total Cost Category")
      ?.map(node => {
        return mapToGolCostDto(node?.node ?? null, pickList, { costCategories });
      }) ?? []
  );
}
