import { CostCategoryType } from "@framework/constants/enums";
import { PCROrganisationType } from "@framework/constants/pcrConstants";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { costCategoryTypeMapper } from "@framework/mappers/costCategory";
import { numberComparator } from "@framework/util/comparator";

/**
 * from the root `Acc_CostCategory__c` node
 */
type CostCategoryNode = GQL.PartialNode<{
  Id: string;
  Acc_CompetitionType__c: GQL.Value<string>;
  Acc_CostCategoryName__c: GQL.Value<string>;
  Acc_HintText__c: GQL.Value<string>;
  Acc_DisplayOrder__c: GQL.Value<number>;
  Acc_OrganisationType__c: GQL.Value<string>;
}>;

/**
 * from the root `Acc_Profile__c` node
 */
type ProfileNodeForRequiredCostCategories = GQL.Maybe<
  ReadonlyArray<
    GQL.Maybe<{
      node: GQL.Maybe<{
        Acc_CostCategory__c: GQL.Value<string>;
      }>;
    }>
  >
>;

export type CostCategoryDtoMapping = Pick<
  CostCategoryDto,
  "id" | "competitionType" | "name" | "isCalculated" | "organisationType" | "type" | "hintText"
> & { displayOrder: number };

type CostCategoryAdditionalData = {
  overheadRate?: number;
};

const mapper: GQL.DtoMapper<CostCategoryDtoMapping, CostCategoryNode, CostCategoryAdditionalData> = {
  competitionType(node) {
    return node?.Acc_CompetitionType__c?.value ?? "unknown";
  },
  displayOrder(node) {
    return node?.Acc_DisplayOrder__c?.value ?? 0;
  },
  hintText(node) {
    return node?.Acc_HintText__c?.value ?? "";
  },
  id(node) {
    return (node?.Id ?? "") as CostCategoryId;
  },
  isCalculated(node, additionalData) {
    const type = this.type(node, additionalData);
    return type === CostCategoryType.Overheads && typeof additionalData.overheadRate === "number";
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
  additionalData: CostCategoryAdditionalData = {},
): Pick<CostCategoryDtoMapping, PickList> {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](node, additionalData);
    return dto;
  }, {} as Pick<CostCategoryDtoMapping, PickList>);
}

/**
 * Maps CostCategory Edge to array of Cost Category DTOs.
 */
export function mapToCostCategoryDtoArray<
  T extends ReadonlyArray<GQL.Maybe<{ node: CostCategoryNode }>> | null,
  PickList extends keyof CostCategoryDtoMapping,
>(
  edges: T,
  pickList: PickList[],
  additionalData: CostCategoryAdditionalData = {},
): Pick<CostCategoryDtoMapping, PickList>[] {
  return (
    edges?.map(node => {
      return mapToCostCategoryDto(node?.node ?? null, pickList, additionalData);
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
  T extends ReadonlyArray<GQL.Maybe<{ node: CostCategoryNode }>> | null,
  PickList extends keyof CostCategoryDtoMapping,
>(
  edges: T,
  pickList: [...["id", "name", "displayOrder"], ...PickList[]],
  profileNode: ProfileNodeForRequiredCostCategories,
  additionalData: CostCategoryAdditionalData = {},
): Pick<CostCategoryDtoMapping, "id" | "name" | "displayOrder" | PickList>[] {
  return (edges ?? [])
    .map(node => {
      return mapToCostCategoryDto(node?.node ?? null, pickList, additionalData);
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
