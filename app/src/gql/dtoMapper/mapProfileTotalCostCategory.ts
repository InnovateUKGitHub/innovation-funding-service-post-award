import { GOLCostDto } from "@framework/dtos/golCostDto";

// on Acc_Profile__c WHERE Acc_ProjectID__c=ProjectID AND RecordType.Name="Total Project Period"
type ProfileTotalCostCategoryNode = Readonly<
  Partial<{
    Acc_CostCategoryGOLCost__c: GQL.Value<number>;
    Acc_CostCategory__c: GQL.Value<string>;
    Acc_CostCategory__r: {
      Id: string;
      Acc_CostCategoryName__c: GQL.Value<string>;
    } | null;
  }>
> | null;

const mapper: GQL.DtoMapper<GOLCostDto, ProfileTotalCostCategoryNode> = {
  value(node) {
    return node?.Acc_CostCategoryGOLCost__c?.value ?? 0;
  },
  costCategoryId(node) {
    return node?.Acc_CostCategory__c?.value ?? node?.Acc_CostCategory__r?.Id ?? "";
  },
  costCategoryName(node) {
    return node?.Acc_CostCategory__r?.Acc_CostCategoryName__c?.value ?? "";
  },
};

/**
 * Maps a specified ProfileTotalCostCategory Node from a GQL query to a slice of
 * the ProfileTotalCostCategory to ensure consistency and compatibility in the application
 */
export function mapToProfileTotalCostCategoryDto<
  T extends ProfileTotalCostCategoryNode,
  PickList extends keyof GOLCostDto,
>(node: T, pickList: PickList[]): Pick<GOLCostDto, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<GOLCostDto, PickList>);
}

/**
 * Maps ProfileTotalCostCategory Edge to array of Loan DTOs.
 */
export function mapToProfileTotalCostCategoryDtoArray<
  T extends ReadonlyArray<{ node: ProfileTotalCostCategoryNode } | null> | null,
  PickList extends keyof GOLCostDto,
>(edges: T, pickList: PickList[]): Pick<GOLCostDto, PickList>[] {
  return (
    edges?.map(node => {
      return mapToProfileTotalCostCategoryDto(node?.node ?? null, pickList);
    }) ?? []
  );
}
