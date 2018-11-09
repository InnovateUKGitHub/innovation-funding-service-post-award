import { IContext, IQuery } from "../common/context";
import mapClaim from "./mapClaim";
import {dateComparator} from "../../../util/comparator";

export class GetAllForPartnerQuery implements IQuery<ClaimDto[]> {
    constructor(private partnerId: string) {
    }

    public async Run(context: IContext) {
        const claims = await context.repositories.claims.getAllByPartnerId(this.partnerId);
        const forcasts = await context.repositories.profileTotalPeriod.getAllByPartnerId(this.partnerId);
        const joined = claims.map(claim => ({ claim, forcast: forcasts.find(x => x.Acc_ProjectPeriodNumber__c === claim.Acc_ProjectPeriodNumber__c) }));

        return joined.map(x => mapClaim(context)(x.claim, x.forcast))
            .sort((x, y) => dateComparator(y.periodEndDate, x.periodEndDate));
    }
}
