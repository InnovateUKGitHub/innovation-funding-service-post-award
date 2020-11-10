import { QueryBase } from "@server/features/common";
import { ClaimDetailsSummaryDto, IContext } from "@framework/types";
import { mapClaimDetailsSummary } from "./mapClaimDetails";

export class GetAllClaimDetailsByPartner extends QueryBase<ClaimDetailsSummaryDto[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const items = await context.repositories.claimDetails.getAllByPartner(this.partnerId);
    return items.map(claimDetail => mapClaimDetailsSummary(claimDetail, context));
  }
}
