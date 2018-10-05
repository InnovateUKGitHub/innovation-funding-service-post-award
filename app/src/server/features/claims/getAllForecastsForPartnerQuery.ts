import { IContext, IQuery } from "../common/context";
import { ForecastDetailsDTO } from "../../../ui/models";

export class GetAllForecastsForPartnerQuery implements IQuery<ForecastDetailsDTO[]> {
  constructor(
    private partnerId: string,
    private periodId: number
  ) {}

  public async Run(context: IContext) {
    const results = await context.repositories.profileDetails.getAllByPartnerWithPeriodGt(this.partnerId, this.periodId);
    return results.map(x => ({
      costCategoryId: x.Acc_CostCategory__c,
      periodId: x.Acc_ProjectPeriodId__c,
      value: x.Acc_PeriodCostCategoryTotal__c
    }));
  }
}
