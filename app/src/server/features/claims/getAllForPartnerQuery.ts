import { IContext, IQuery } from "../common/context";
import { ClaimDto } from "../../../ui/models/claimDto";
import mapClaim from "./mapClaim";
import {dateComparator} from "../../../util/comparator";

export class GetAllForPartnerQuery implements IQuery<ClaimDto[]> {
    constructor(private partnerId: string) {
    }

    public async Run(context: IContext) {
        const results = await context.repositories.claims.getAllByPartnerId(this.partnerId);
        return results && results
          .map(mapClaim(context))
          .sort((x, y) => dateComparator(y.periodEndDate, x.periodEndDate));
    }
}

export class GetByPartnerAndPeriodQuery implements IQuery<ClaimDto|null> {
    constructor(private partnerId: string, private periodId: number) {}

    public async Run(context: IContext) {
        const result = await context.repositories.claims.getByPartnerIdAndPeriodId(this.partnerId, this.periodId);
        return result && mapClaim(context)(result);
    }
}
