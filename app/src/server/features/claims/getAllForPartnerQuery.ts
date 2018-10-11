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
