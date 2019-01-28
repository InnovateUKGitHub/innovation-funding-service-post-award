import { QueryBase } from "../common/queryBase";
import { IContext } from "../../../types/IContext";

export class GetAllForecastsGOLCostsQuery extends QueryBase<GOLCostDto[]> {
  constructor(private partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const results = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    return results.map(x => ({
      costCategoryId: x.Acc_CostCategory__c,
      value: x.Acc_CostCategoryGOLCost__c
    }));
  }
}
