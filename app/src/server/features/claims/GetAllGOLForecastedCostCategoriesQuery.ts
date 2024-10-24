import { GOLCostDto } from "@framework/dtos/golCostDto";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetUnfilteredCostCategoriesQuery } from "./getCostCategoriesQuery";
import { CostCategoryList } from "@framework/types/CostCategory";

export class GetAllGOLForecastedCostCategoriesQuery extends AuthorisedAsyncQueryBase<GOLCostDto[]> {
  public readonly runnableName: string = "GetAllGOLForecastedCostCategoriesQuery";
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const costCategories = await context.runQuery(new GetUnfilteredCostCategoriesQuery());
    const costCategoriesOrder = costCategories.map(y => y.id);

    const results = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const mapped = results.map<GOLCostDto>(x => {
      const costCategoryName = costCategories
        .filter(costCategory => costCategory.id === x.Acc_CostCategory__c)
        .map(costCategory => costCategory.name)[0];

      const type = new CostCategoryList().fromName(costCategoryName).id;

      return {
        costCategoryId: x.Acc_CostCategory__c as CostCategoryId,
        costCategoryName,
        value: x.Acc_CostCategoryGOLCost__c,
        type,
      };
    });

    return mapped.sort(
      (x, y) => costCategoriesOrder.indexOf(x.costCategoryId) - costCategoriesOrder.indexOf(y.costCategoryId),
    );
  }
}
