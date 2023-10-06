import { Profile } from "@framework/constants/recordTypes";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { equalityIfDefined } from "./equalityIfDefined";
import { CostCategoryList } from "@framework/types/CostCategory";

// on Acc_Profile__c with DeveloperName "Total_Cost_Category"
type GolCostNode = GQL.PartialNode<{
  Id: string;
  Acc_CostCategory__c: GQL.Value<string>;
  Acc_CostCategoryGOLCost__c: GQL.Value<number>;
  RecordType: GQL.Maybe<{
    DeveloperName?: GQL.Value<string>;
  }>;
  Acc_CostCategory__r: GQL.Maybe<{
    Id: string;
    Acc_CostCategoryName__c: GQL.Value<string>;
  }>;
}>;

type GolCostDtoMapping = Pick<GOLCostDto, "costCategoryId" | "costCategoryName" | "value" | "type">;

const mapper: GQL.DtoMapper<
  GolCostDtoMapping,
  GolCostNode,
  { costCategories?: { id: CostCategoryId; name: string }[] }
> = {
  costCategoryId: function (node) {
    return (node?.Acc_CostCategory__r?.Id ?? node?.Acc_CostCategory__c?.value ?? "unknown category") as CostCategoryId;
  },
  costCategoryName: function (node, additionalData) {
    return (
      node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ??
      additionalData?.costCategories
        ?.filter(costCategory => costCategory.id === node?.Acc_CostCategory__c?.value)
        .map(costCategory => costCategory.name)[0] ??
      ""
    );
  },
  value: function (node) {
    return node?.Acc_CostCategoryGOLCost__c?.value ?? 0;
  },
  type: function (node, additionalData) {
    return new CostCategoryList().fromName(mapper.costCategoryName(node, additionalData)).id;
  },
};

/**
 * Maps a specified GolCost Node from a GQL query to a slice of
 * the GolCostDto to ensure consistency and compatibility in the application
 */
export function mapToGolCostDto<
  T extends GolCostNode,
  PickList extends keyof GolCostDtoMapping,
  AdditionalData extends { costCategories?: { id: CostCategoryId; name: string }[] },
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
  T extends ReadonlyArray<GQL.Maybe<{ node: GolCostNode }>> | null,
  PickList extends keyof GolCostDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  costCategories?: { id: CostCategoryId; name: string }[],
): Pick<GolCostDtoMapping, PickList>[] {
  return (
    edges
      ?.filter(x => equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Profile.totalCostCategory))
      ?.map(node => {
        return mapToGolCostDto(node?.node ?? null, pickList, { costCategories });
      }) ?? []
  );
}
