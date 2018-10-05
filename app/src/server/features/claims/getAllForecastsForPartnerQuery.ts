import { IContext, IQuery } from "../common/context";
// import { ClaimDetailsDto } from "../../../ui/models";

interface ProfileDetailsDTO {
  costCategoryId: string;
  periodId: number;
  value: number;
}

export class GetAllForecastsForPartnerQuery implements IQuery<ProfileDetailsDTO[]> {
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
