import { QueryBase, SALESFORCE_DATE_FORMAT } from "../common";
import { IContext } from "../../../types";
import { mapClaimDetails } from "./mapClaimDetails";

export class GetAllClaimDetailsByPartner extends QueryBase<ClaimDetailsDto[]> {
  constructor(private readonly partnerId: string) {
    super();
  }

  protected async Run(context: IContext) {
    const items = await context.repositories.claimDetails.getAllByPartner(this.partnerId);
    return items.map(claimDetail => mapClaimDetails(claimDetail, context));
  }
}
