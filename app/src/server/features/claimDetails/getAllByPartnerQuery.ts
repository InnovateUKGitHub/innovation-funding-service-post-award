import {IContext, QueryBase} from "../common/context";

export class GetAllClaimDetailsByPartner extends QueryBase<ClaimDetailsDto[]> {
  constructor(private partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.claimDetails.getAllByPartner(this.partnerId)
      .then((claimDetails) => claimDetails.map(x => ({
        periodId: x.Acc_ProjectPeriodNumber__c,
        periodStart: context.clock.parse(x.Acc_ProjectPeriodStartDate__c, "yyyy-MM-dd"),
        periodEnd: context.clock.parse(x.Acc_ProjectPeriodEndDate__c, "yyyy-MM-dd"),
        costCategoryId: x.Acc_CostCategory__c,
        value: x.Acc_PeriodCostCategoryTotal__c
      })));
  }
}
