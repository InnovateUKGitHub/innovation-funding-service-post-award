import {IContext, IQuery} from "../common/context";
import mapClaim from "./mapClaim";
import { numberComparator } from "../../../util/comparator";

export class GetAllClaimsForProjectQuery implements IQuery<ClaimDto[]> {
    constructor(private projectId: string) {
    }

    public async Run(context: IContext) {
        const claims = await context.repositories.claims.getAllByProjectId(this.projectId);
        const forcasts = await context.repositories.profileTotalPeriod.getAllByProjectId(this.projectId);
        const joined = claims.map(claim => ({ claim, forcast: forcasts.find(x => x.Acc_ProjectParticipant__c === claim.Acc_ProjectParticipant__c && x.Acc_ProjectPeriodNumber__c === claim.Acc_ProjectPeriodNumber__c) }));
        const mapped = joined.map(x => mapClaim(context)(x.claim, x.forcast));
        mapped.sort((x, y) => numberComparator(x.periodId, y.periodId));
        return mapped;
    }
}
