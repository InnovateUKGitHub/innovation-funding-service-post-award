import { QueryBase } from "../common";
import { IContext } from "../../../types";

export class GetAllForecastsGOLCostsQuery extends QueryBase<GOLCostDto[]> {
  constructor(private readonly partnerId: string) {
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
