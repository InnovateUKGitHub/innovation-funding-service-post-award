import {QueryBase} from "../common/queryBase";
import mapClaim from "./mapClaim";
import { ClaimDto } from "../../../types";
import { IContext } from "../../../types/IContext";

// TODO - nullable or throw to be decided
export class GetClaim extends QueryBase<ClaimDto> {
  constructor(private partnerId: string, private periodId: number) {
    super();
  }

  protected async Run(context: IContext) {
    const result = await context.repositories.claims.get(this.partnerId, this.periodId);
    const forcast = await context.repositories.profileTotalPeriod.get(this.partnerId, this.periodId);
    return result && mapClaim(context)(result, forcast);
  }
}
