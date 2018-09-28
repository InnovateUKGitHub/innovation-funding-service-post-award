import {IContext, IQuery} from "../common/context";
import {ClaimLineItemDto} from "../../../ui/models";

export class GetAllLineItemsForClaimByCategoryQuery implements IQuery<ClaimLineItemDto[]> {
  constructor(public partnerId: string, public costCategoryId: number, public periodId: number) {
  }

  public async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];

    return data.map<ClaimLineItemDto>(item => ({
      id: item.Id,
      description: item.Acc_LineItemDescription__c,
      value: item.Acc_LineItemCost__c
    }));
  }
}
