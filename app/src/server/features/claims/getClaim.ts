import {IContext, IQuery} from "../common/context";
import {ClaimDto} from "../../../ui/models/claimDto";
import mapClaim from "./mapClaim";

export class GetClaim implements IQuery<ClaimDto | null> {
  constructor(private partnerId: string, private periodId: number) {
  }

  public async Run(context: IContext) {
    const result = await context.repositories.claims.get(this.partnerId, this.periodId);
    const forcast = await context.repositories.profileTotalPeriod.get(this.partnerId, this.periodId);
    return result && mapClaim(context)(result, forcast);
  }
}
