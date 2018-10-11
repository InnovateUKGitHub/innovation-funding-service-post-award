import {IContext, IQuery} from "../common/context";
import {ForecastDetailsDTO} from "../../../ui/models";

export class GetProfileDetail implements IQuery<ForecastDetailsDTO> {
  constructor(private partnerId: string,
              private periodId: number,
              private costCategoryId: string,) {
  }

  public async Run(context: IContext) {
    const result = await context.repositories.profileDetails.getById(this.partnerId, this.periodId, this.costCategoryId);
    return {
      costCategoryId: result.Acc_CostCategory__c,
      periodId: result.Acc_ProjectPeriodNumber__c,
      value: result.Acc_PeriodCostCategoryTotal__c
    };
  }
}
