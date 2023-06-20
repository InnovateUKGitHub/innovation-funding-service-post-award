import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { mapClaimDetailsSummary } from "./mapClaimDetails";

export class GetAllClaimDetailsByPartner extends QueryBase<ClaimDetailsSummaryDto[]> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const items = await context.repositories.claimDetails.getAllByPartner(this.partnerId);
    return items.map(claimDetail => mapClaimDetailsSummary(claimDetail, context));
  }
}
