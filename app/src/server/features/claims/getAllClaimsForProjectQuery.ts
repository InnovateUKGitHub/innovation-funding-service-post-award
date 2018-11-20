import { IContext, IQuery } from "../common/context";
import mapClaim from "./mapClaim";
import { ClaimDto } from "../../../types";

export class GetAllClaimsForProjectQuery implements IQuery<ClaimDto[]> {
  constructor(private projectId: string) {
  }

  public async Run(context: IContext) {
    const claims = await context.repositories.claims.getAllByProjectId(this.projectId);
    const forcasts = await context.repositories.profileTotalPeriod.getAllByProjectId(this.projectId);
    const joined = claims.map(claim => ({ claim, forcast: forcasts.find(x => x.Acc_ProjectParticipant__c === claim.Acc_ProjectParticipant__r.Id && x.Acc_ProjectPeriodNumber__c === claim.Acc_ProjectPeriodNumber__c) }));
    const sorted = joined.sort((x, y) => {

      // if x is not lead but y is lead then y is bigger
      if (x.claim.Acc_ProjectParticipant__r.Acc_ProjectRole__c !== "Project Lead" && y.claim.Acc_ProjectParticipant__r.Acc_ProjectRole__c === "Project Lead") {
        return 1;
      }
      // if x is lead but y is not lead then x is bigger
      if (x.claim.Acc_ProjectParticipant__r.Acc_ProjectRole__c === "Project Lead" && y.claim.Acc_ProjectParticipant__r.Acc_ProjectRole__c !== "Project Lead") {
        return -1;
      }

      // if x partner name is after y partner name then y is bigger
      if (x.claim.Acc_ProjectParticipant__r.Acc_AccountId__r.Name > y.claim.Acc_ProjectParticipant__r.Acc_AccountId__r.Name) {
        return 1;
      }

      // if x partner name is before y partner name then x is bigger
      if (x.claim.Acc_ProjectParticipant__r.Acc_AccountId__r.Name < y.claim.Acc_ProjectParticipant__r.Acc_AccountId__r.Name) {
        return -1;
      }

      // if x periodId is after y.periodId then x is bigger
      if (x.claim.Acc_ProjectPeriodNumber__c > y.claim.Acc_ProjectPeriodNumber__c) {
        return -1;
      }

      // if x periodId is before y.periodId then y is bigger
      if (x.claim.Acc_ProjectPeriodNumber__c < y.claim.Acc_ProjectPeriodNumber__c) {
        return 1;
      }

      return 0;
    });

    const mapped = sorted.map(x => mapClaim(context)(x.claim, x.forcast));
    return mapped;
  }
}
