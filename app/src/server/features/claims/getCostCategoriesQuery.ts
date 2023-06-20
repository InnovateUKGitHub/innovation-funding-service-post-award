import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { CostCategory } from "@framework/entities/costCategory";
import { IContext } from "@framework/types/IContext";
import { numberComparator } from "@framework/util/comparator";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { QueryBase } from "../common/queryBase";

/**
 * Retrieves all cost categories from salesforce
 *
 * Cost categories are applied to a partner based on the organisationType of that partner and the competitionType of the project
 *
 * **Uses a cache to improve performance**
 *
 */
export class GetUnfilteredCostCategoriesQuery extends QueryBase<CostCategoryDto[]> {
  protected async run(context: IContext) {
    return context.caches.costCategories.fetchAsync("All", () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const data = await context.repositories.costCategories.getAll();

    data.sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return data.map(({ displayOrder, ...x }) => x);
  }
}

export class GetFilteredCostCategoriesQuery extends QueryBase<CostCategoryDto[]> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    return context.caches.costCategories.fetchAsync(storeKeys.getCostCategoryKey(this.partnerId), () =>
      this.executeQuery(context),
    );
  }

  private async executeQuery(context: IContext) {
    const allCategories = await context.repositories.costCategories.getAll();
    const requiredCategories = await context.repositories.profileDetails.getRequiredCategories(this.partnerId);

    const filteredCategories = this.filterCostCategories(allCategories, requiredCategories);
    filteredCategories.sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return filteredCategories.map(({ displayOrder, ...x }) => x);
  }

  private filterCostCategories(costCategories: CostCategory[], baseCategories: ISalesforceProfileDetails[]) {
    return costCategories.filter(category => {
      const isValidCategory = !!category.name;
      return isValidCategory && baseCategories.find(c => c.Acc_CostCategory__c === category.id);
    });
  }
}
