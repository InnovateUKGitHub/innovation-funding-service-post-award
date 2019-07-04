import { QueryBase } from "../common/queryBase";
import { IContext } from "@framework/types";
import { numberComparator } from "@framework/util";

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
