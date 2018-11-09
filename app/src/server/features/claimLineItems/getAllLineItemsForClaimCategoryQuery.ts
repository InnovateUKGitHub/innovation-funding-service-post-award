import {IContext, IQuery} from "../common/context";
import mapClaimLineItem from "./mapClaimLineItem";

export class GetAllLineItemsForClaimByCategoryQuery implements IQuery<ClaimLineItemDto[]> {
  constructor(public partnerId: string, public costCategoryId: string, public periodId: number) {
  }

  public async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];

    return data.map<ClaimLineItemDto>( mapClaimLineItem(context));
  }
}
