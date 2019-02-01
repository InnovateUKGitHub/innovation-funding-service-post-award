import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { IContext } from "../../../types";

export class GetAllClaimDetailsByPartner extends QueryBase<ClaimDetailsDto[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    return context.repositories.claimDetails.getAllByPartner(this.partnerId)
      .then((claimDetails) => claimDetails.map(x => ({
        periodId: x.Acc_ProjectPeriodNumber__c,
        periodStart: context.clock.parse(x.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT),
        periodEnd: context.clock.parse(x.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT),
        costCategoryId: x.Acc_CostCategory__c,
        value: x.Acc_PeriodCostCategoryTotal__c
      })));
  }
}
