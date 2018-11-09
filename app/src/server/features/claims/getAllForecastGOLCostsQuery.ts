import { IContext, IQuery } from "../common/context";

export class GetAllForecastsGOLCostsQuery implements IQuery<GOLCostDto[]> {
  constructor(private partnerId: string) {}

  public async Run(context: IContext) {
    const results = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    return results.map(x => ({
      costCategoryId: x.Acc_CostCategory__c,
      value: x.Acc_CostCategoryGOLCost__c
    }));
  }
}
