import { PCROrganisationType } from "@framework/constants";
import type { CostCategoryDto } from "@framework/dtos";
import { costCategoryTypeMapper } from "@framework/mappers/costCategory";
import { numberComparator } from "@framework/util";

/**
 * from the root `Acc_CostCategory__c` node
 */
type CostCategoryNode = Readonly<
  Partial<{
    Id: string;
    Acc_CompetitionType__c: GQL.Value<string>;
    Acc_CostCategoryName__c: GQL.Value<string>;
    Acc_DisplayOrder__c: GQL.Value<number>;
    Acc_OrganisationType__c: GQL.Value<string>;
  }>
> | null;

/**
 * from the root `Acc_Profile__c` node
 */
type ProfileNodeForRequiredCostCategories = ReadonlyArray<{
  node: {
    Acc_CostCategory__c: GQL.Value<string>;
  } | null;
} | null> | null;

type CostCategoryDtoMapping = Pick<
  CostCategoryDto,
  "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type"
> & { displayOrder: number };

const mapper: GQL.DtoMapper<CostCategoryDtoMapping, CostCategoryNode> = {
  competitionType(node) {
    return node?.Acc_CompetitionType__c?.value ?? "unknown";
  },
  displayOrder(node) {
    return node?.Acc_DisplayOrder__c?.value ?? 0;
  },
  id(node) {
    return node?.Id ?? "";
  },
  isCalculated() {
    return false;
  },
  organisationType(node) {
    return (node?.Acc_OrganisationType__c?.value ?? "unknown") as PCROrganisationType;
  },
  name(node) {
    return node?.Acc_CostCategoryName__c?.value ?? "";
  },
  type(node) {
    return costCategoryTypeMapper(
      node?.Acc_OrganisationType__c?.value ?? "Unknown",
      node?.Acc_CostCategoryName__c?.value ?? "unknown",
    );
  },
};

/**
 * Maps a specified CostCategory Node from a GQL query to a slice of
 * the CostCategoryDto to ensure consistency and compatibility in the application
 */
export function mapToCostCategoryDto<T extends CostCategoryNode, PickList extends keyof CostCategoryDtoMapping>(
  node: T,
  pickList: PickList[],
): Pick<CostCategoryDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node);
    return dto;
  }, {} as Pick<CostCategoryDtoMapping, PickList>);
}

/**
 * Maps CostCategory Edge to array of Cost Category DTOs.
 */
export function mapToCostCategoryDtoArray<
  T extends ReadonlyArray<{ node: CostCategoryNode } | null> | null,
  PickList extends keyof CostCategoryDtoMapping,
>(edges: T, pickList: PickList[]): Pick<CostCategoryDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToCostCategoryDto(node?.node ?? null, pickList);
    }) ?? []
  );
}

/**
 * Maps CostCategory Edge to filtered and sorted list of cost categories.
 *
 * `id`, `name` and `displayOrder` are required fields as is an array of requiredCategory Ids
 *
 * This also requires the `Acc_Profile__c` root node containing `Acc_CostCategory__c`
 */
export function mapToRequiredSortedCostCategoryDtoArray<
  T extends ReadonlyArray<{ node: CostCategoryNode } | null> | null,
  PickList extends keyof CostCategoryDtoMapping,
>(
  edges: T,
  pickList: [...["id", "name", "displayOrder"], ...PickList[]],
  profileNode: ProfileNodeForRequiredCostCategories,
): Pick<CostCategoryDtoMapping, "id" | "name" | "displayOrder" | PickList>[] {
  return (edges ?? [])
    .map(node => {
      return mapToCostCategoryDto(node?.node ?? null, pickList);
    })
    .filter(
      x =>
        !!x?.name &&
        (profileNode ?? []).some(
          profile => (profile?.node?.Acc_CostCategory__c?.value ?? "unknown category id") === x.id,
        ),
    )
    .sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));
}
