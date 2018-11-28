import {IContext, QueryBase} from "../common/context";
import mapClaimLineItem from "./mapClaimLineItem";

export class GetAllLineItemsForClaimByCategoryQuery extends QueryBase<ClaimLineItemDto[]> {
  constructor(public partnerId: string, public costCategoryId: string, public periodId: number) {
    super();
  }

  protected async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];

    return data.map<ClaimLineItemDto>( mapClaimLineItem(context));
  }
}
