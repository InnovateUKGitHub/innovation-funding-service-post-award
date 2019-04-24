import { QueryBase } from "@server/features/common";
import { IContext } from "@framework/types";
import { mapClaimDetails } from "./mapClaimDetails";

export class GetClaimDetailsQuery extends QueryBase<ClaimDetailsDto> {
  constructor(
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string,
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const item = await context.repositories.claimDetails.get({ partnerId: this.partnerId, periodId: this.periodId, costCategoryId: this.costCategoryId });
    if (!item) {
      // todo: throw once overheads renenabled?
      return ({
        id: "",
        costCategoryId: this.costCategoryId,
        periodId: this.periodId,
        periodStart: null,
        periodEnd: null,
        value: 0,
        comments: null,
      });
    }
    return mapClaimDetails(item, context);
  }
}
