import { QueryBase } from "../common";
import { IContext } from "@framework/types";
import { GetCostCategoriesQuery } from "./getCostCategoriesQuery";

export class GetAllForecastsGOLCostsQuery extends QueryBase<GOLCostDto[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const costCategoriesOrder = costCategories.map(y => y.id);

    const results = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const mapped = results.map(x => ({
      costCategoryId: x.Acc_CostCategory__c,
      value: x.Acc_CostCategoryGOLCost__c,
    }));

    return mapped.sort((x,y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId));
  }
}
