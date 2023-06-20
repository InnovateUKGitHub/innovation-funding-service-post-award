import { ClaimDto } from "@framework/dtos/claimDto";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { mapClaim } from "./mapClaim";

// @TODO - nullable or throw to be decided
export class GetClaim extends QueryBase<ClaimDto> {
  constructor(private readonly partnerId: PartnerId, private readonly periodId: number) {
    super();
  }

  protected async run(context: IContext) {
    const partner = await context.repositories.partners.getById(this.partnerId);
    const result = await context.repositories.claims.get(this.partnerId, this.periodId);
    const forecast = await context.repositories.profileTotalPeriod.get(this.partnerId, this.periodId);

    return result && mapClaim(context)(result, partner.competitionType, forecast);
  }
}
