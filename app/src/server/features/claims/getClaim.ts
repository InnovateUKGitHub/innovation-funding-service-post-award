import {IContext, IQuery} from "../common/context";
import mapClaim from "./mapClaim";
import { ClaimDto } from "../../../types";

// TODO - nullable or throw to be decided
export class GetClaim implements IQuery<ClaimDto> {
  constructor(private partnerId: string, private periodId: number) {
  }

  public async Run(context: IContext) {
    const result = await context.repositories.claims.get(this.partnerId, this.periodId);
    const forcast = await context.repositories.profileTotalPeriod.get(this.partnerId, this.periodId);
    return result && mapClaim(context)(result, forcast);
  }
}
