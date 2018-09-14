import {ISalesforceClaim} from "../../repositories/claimsRepository";
import {IContext} from "../common/context";
import {ClaimDto} from "../../../ui/models";

export default (context: IContext) => (claim: ISalesforceClaim): ClaimDto => ({
  id: claim.Id,
  partnerId: claim.Acc_ProjectParticipant__c,
  lastModifiedDate: context.clock().parse(claim.LastModifiedDate),
  status: claim.Acc_ClaimStatus__c,
  periodStartDate: context.clock().parse(claim.Acc_ProjectPeriodStartDate_c),
  periodEndDate: context.clock().parse(claim.Acc_ProjectPeriodEndDate__c),
  periodId: claim.Acc_ProjectPeriodID__c,
  totalCost: claim.Acc_TotalCost__c,
  forecastCost: claim.Acc_ForecastCost__c,
  approvedDate: claim.Acc_ApprovedDate__c === null ? null : context.clock().parse(claim.Acc_ApprovedDate__c),
  paidDate: claim.Acc_PaidDate__c === null ? null : context.clock().parse(claim.Acc_PaidDate__c),
});
