import { QueryBase } from "../common/queryBase";
import { IContext } from "@framework/types";
import { numberComparator } from "@framework/util";

/** 
 * Retrieves all cost categories from salesforce
 *
 * Cost categories are applied to a partner based on the organisationType of that partner and the competitionType of the project
 * 
 * **Uses a cache to improve performance**
 * 
*/
export class GetCostCategoriesQuery extends QueryBase<CostCategoryDto[]> {
  protected async Run(context: IContext) {
    return context.caches.costCategories.fetchAsync("All", () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const data = await context.repositories.costCategories.getAll();

    data.sort((a, b) => numberComparator(a.displayOrder, b.displayOrder));

    return data.map(x => {
      const { displayOrder, ...rest } = x;
      return rest;
    });
  }
}
