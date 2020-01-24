import { DateTime } from "luxon";
import { ISalesforceClaim, ISalesforceProfileTotalPeriod } from "@server/repositories";
import { SALESFORCE_DATE_FORMAT } from "@server/features/common";
import { ClaimDto, ClaimStatus, IContext } from "@framework/types";

const STATUS_ALLOWING_IAR_EDIT = [
  ClaimStatus.DRAFT,
  ClaimStatus.SUBMITTED,
  ClaimStatus.MO_QUERIED,
  ClaimStatus.AWAITING_IAR,
  ClaimStatus.INNOVATE_QUERIED,
];

export default (context: IContext) => (claim: ISalesforceClaim, forecast?: ISalesforceProfileTotalPeriod): ClaimDto => {
  const claimStatus = mapToClaimStatus(claim.Acc_ClaimStatus__c);
  return {
    id: claim.Id,
    partnerId: claim.Acc_ProjectParticipant__r.Id,
    lastModifiedDate: DateTime.fromISO(claim.LastModifiedDate).toJSDate(),
    status: claimStatus,
    statusLabel: claim.ClaimStatusLabel,
    periodStartDate: context.clock.parse(claim.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT)!,
    periodEndDate: context.clock.parse(claim.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT)!,
    periodId: claim.Acc_ProjectPeriodNumber__c,
    totalCost: claim.Acc_ProjectPeriodCost__c,
    forecastCost: forecast && forecast.Acc_PeriodInitialForecastCost__c || 0,
    approvedDate: claim.Acc_ApprovedDate__c === null ? null : context.clock.parse(claim.Acc_ApprovedDate__c, SALESFORCE_DATE_FORMAT),
    paidDate: claim.Acc_PaidDate__c === null ? null : context.clock.parse(claim.Acc_PaidDate__c, SALESFORCE_DATE_FORMAT),
    comments: claim.Acc_ReasonForDifference__c,
    isIarRequired: claim.Acc_IARRequired__c,
    isApproved: [ClaimStatus.APPROVED, ClaimStatus.PAID].indexOf(claimStatus) >= 0,
    allowIarEdit: STATUS_ALLOWING_IAR_EDIT.indexOf(claimStatus) >= 0,
    overheadRate: claim.Acc_ProjectParticipant__r.Acc_OverheadRate__c,
    isFinalClaim: claim.Acc_FinalClaim__c,
  };
};

export const mapToClaimStatus = (status: string): ClaimStatus => {
  for (const claimStatus in ClaimStatus) {
    if (status === ClaimStatus[claimStatus as keyof typeof ClaimStatus]) return status;
  }
  return ClaimStatus.UNKNOWN;
};
