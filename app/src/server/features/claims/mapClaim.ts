import {ISalesforceClaim} from "../../repositories/claimsRepository";

export default (claim: ISalesforceClaim) => ({
  id: claim.Id,
  partnerId: claim.Acc_ProjectParticipant__c
});
