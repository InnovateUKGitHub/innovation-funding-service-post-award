import { GOLCostDto } from "@framework/dtos/golCostDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { GetUnfilteredCostCategoriesQuery } from "./getCostCategoriesQuery";

export class GetAllForecastsGOLCostsQuery extends QueryBase<GOLCostDto[]> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategoriesOrder = costCategories.map(y => y.id);

    const results = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const mapped = results.map<GOLCostDto>(x => ({
      costCategoryId: x.Acc_CostCategory__c as CostCategoryId,
      costCategoryName: costCategories
        .filter(costCategory => costCategory.id === x.Acc_CostCategory__c)
        .map(costCategory => costCategory.name)[0],
      value: x.Acc_CostCategoryGOLCost__c,
    }));

    return mapped.sort(
      (x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId),
    );
  }
}
