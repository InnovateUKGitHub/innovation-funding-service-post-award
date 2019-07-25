import { QueryBase } from "../common/queryBase";
import { dateComparator } from "@framework/util/comparator";
import { ClaimDto, IContext } from "@framework/types";
import mapClaim from "./mapClaim";

export class GetAllForPartnerQuery extends QueryBase<ClaimDto[]> {
    constructor(private readonly partnerId: string) {
        super();
    }

    protected async Run(context: IContext) {
        const claims = await context.repositories.claims.getAllByPartnerId(this.partnerId);
        const forecasts = await context.repositories.profileTotalPeriod.getAllByPartnerId(this.partnerId);
        const joined = claims.map(claim => ({ claim, forecast: forecasts.find(x => x.Acc_ProjectPeriodNumber__c === claim.Acc_ProjectPeriodNumber__c) }));

        return joined.map(x => mapClaim(context)(x.claim, x.forecast))
            .sort((x, y) => dateComparator(y.periodEndDate, x.periodEndDate));
    }
}
