import {IContext, IQuery} from "../../common/context";
import {ClaimDetailsDto} from "../../../../ui/models";

export class GetAllClaimDetailsByPartner implements IQuery<ClaimDetailsDto[]> {
  constructor(private partnerId: string) {
  }

  public async Run(context: IContext) {
    return context.repositories.claimDetails.getAllByPartner(this.partnerId)
      .then((claimDetails) => claimDetails.map(x => ({
        periodId: x.Acc_ProjectPeriodNumber__c,
        costCategoryId: x.Acc_CostCategory__c,
        value: x.Acc_PeriodCostCategoryTotal__c
      })));
  }
}
