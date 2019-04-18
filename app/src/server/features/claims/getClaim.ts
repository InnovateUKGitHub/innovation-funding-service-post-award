import { QueryBase } from "@server/features/common";
import { ClaimDto, IContext } from "@framework/types";
import mapClaim from "./mapClaim";

// TODO - nullable or throw to be decided
export class GetClaim extends QueryBase<ClaimDto> {
  constructor(private readonly partnerId: string, private readonly periodId: number) {
    super();
  }

  protected async Run(context: IContext) {
    const result   = await context.repositories.claims.get(this.partnerId, this.periodId);
    const forecast = await context.repositories.profileTotalPeriod.get(this.partnerId, this.periodId);
    return result && mapClaim(context)(result, forecast);
  }
}
