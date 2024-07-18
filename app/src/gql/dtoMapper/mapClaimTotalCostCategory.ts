import { Claims } from "@framework/constants/recordTypes";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { equalityIfDefined } from "./equalityIfDefined";
import { CostCategoryList } from "@framework/types/CostCategory";

// on Acc_Claims__c with DeveloperName "Total_Cost_Category"
type GolCostNode = GQL.PartialNode<{
  Id: string;
  RecordType: GQL.Maybe<{
    DeveloperName?: GQL.Value<string>;
  }>;
  Acc_CostCategory__r: GQL.Maybe<{
    Id: string;
    Acc_CostCategoryName__c: GQL.Value<string>;
  }>;
}>;

type ClaimTotalCostCategoryMapping = Pick<GOLCostDto, "costCategoryId" | "costCategoryName" | "type">;

const mapper: GQL.DtoMapper<
  ClaimTotalCostCategoryMapping,
  GolCostNode,
  { costCategories?: { id: CostCategoryId; name: string }[] }
> = {
  costCategoryId: function (node) {
    return (node?.Acc_CostCategory__r?.Id ?? "unknown category") as CostCategoryId;
  },
  costCategoryName: function (node, additionalData) {
    return (
      node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ??
      additionalData?.costCategories
        ?.filter(costCategory => costCategory.id === node?.Acc_CostCategory__r?.Id)
        .map(costCategory => costCategory.name)[0] ??
      ""
    );
  },
  type: function (node, additionalData) {
    return new CostCategoryList().fromName(mapper.costCategoryName(node, additionalData)).id;
  },
};

/**
 * Maps a specified GolCost Node from a GQL query to a slice of
 * the GolCostDto to ensure consistency and compatibility in the application
 */
export function mapToClaimTotalCostCategoryDto<
  T extends GolCostNode,
  PickList extends keyof ClaimTotalCostCategoryMapping,
  AdditionalData extends { costCategories?: { id: CostCategoryId; name: string }[] },
>(node: T, pickList: PickList[], additionalData: AdditionalData): Pick<ClaimTotalCostCategoryMapping, PickList> {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](node, additionalData);
      return dto;
    },
    {} as Pick<ClaimTotalCostCategoryMapping, PickList>,
  );
}

/**
 * Maps GolCost Edge to array of GolCost DTOs.
 *
 * includes filter to make sure only correct record types included
 *
 * requires cost categories array to be passed in
 */
export function mapToClaimTotalCostCategoryDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: GolCostNode }>> | null,
  PickList extends keyof ClaimTotalCostCategoryMapping,
>(
  edges: T,
  pickList: PickList[],
  costCategories?: { id: CostCategoryId; name: string }[],
): Pick<ClaimTotalCostCategoryMapping, PickList>[] {
  return (
    edges
      ?.filter(x => equalityIfDefined(x?.node?.RecordType?.DeveloperName?.value, Claims.totalCostCategory))
      ?.map(node => {
        return mapToClaimTotalCostCategoryDto(node?.node ?? null, pickList, { costCategories });
      }) ?? []
  );
}
