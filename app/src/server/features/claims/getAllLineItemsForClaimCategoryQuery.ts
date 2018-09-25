import {IContext, IQuery} from "../common/context";
import {ClaimLineItemDto} from "../../../ui/models";

export class GetAllLineItemsForClaimByCategoryQuery implements IQuery<ClaimLineItemDto[]> {
  constructor(public claimId: string, public costCategoryId: number) {
  }

  public async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForClaimByCategoryId(this.claimId, this.costCategoryId) || [];

    return data.map<ClaimLineItemDto>(item => ({
      id: item.Id,
      claimId: item.Acc_Claim__c,
      costCategoryId: item.Acc_LineItemCostCategory__c,
      description: item.Acc_LineItemDesc__c,
      value: item.Acc_LineItemValue__c
    }));
  }
}
