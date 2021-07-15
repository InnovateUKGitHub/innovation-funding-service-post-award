import { DateTime } from "luxon";
import { ISalesforceClaim, ISalesforceProfileTotalPeriod } from "@server/repositories";
import { salesforceDateFormat } from "@server/features/common";
import { ClaimDto, ClaimStatus, IContext } from "@framework/types";
import { ReceivedStatus } from "@framework/entities";

const statusAllowingIarEdit = [
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
    pcfStatus: mapToReceivedStatus(claim.Acc_PCF_Status__c),
    status: claimStatus,
    statusLabel: claim.ClaimStatusLabel,
    periodStartDate: context.clock.parse(claim.Acc_ProjectPeriodStartDate__c, salesforceDateFormat)!,
    periodEndDate: context.clock.parse(claim.Acc_ProjectPeriodEndDate__c, salesforceDateFormat)!,
    periodId: claim.Acc_ProjectPeriodNumber__c,
    totalCost: claim.Acc_ProjectPeriodCost__c,
    forecastCost: (forecast && forecast.Acc_PeriodLatestForecastCost__c) || 0,
    approvedDate:
      claim.Acc_ApprovedDate__c === null ? null : context.clock.parse(claim.Acc_ApprovedDate__c, salesforceDateFormat),
    paidDate: claim.Acc_PaidDate__c === null ? null : context.clock.parse(claim.Acc_PaidDate__c, salesforceDateFormat),
    comments: claim.Acc_ReasonForDifference__c,
    iarStatus: mapToReceivedStatus(claim.Acc_IAR_Status__c),
    isIarRequired: claim.Acc_IARRequired__c,
    isApproved: [ClaimStatus.APPROVED, ClaimStatus.PAID, ClaimStatus.PAYMENT_REQUESTED].indexOf(claimStatus) >= 0,
    allowIarEdit: statusAllowingIarEdit.indexOf(claimStatus) >= 0,
    overheadRate: claim.Acc_ProjectParticipant__r.Acc_OverheadRate__c,
    isFinalClaim: claim.Acc_FinalClaim__c,
    totalCostsSubmitted: claim.Acc_TotalCostsSubmitted__c,
    totalCostsApproved: claim.Acc_TotalCostsApproved__c,
    totalDeferredAmount: claim.Acc_TotalDeferredAmount__c, // please see ACC-5639 if changing this
    periodCostsToBePaid: claim.Acc_PeriodCoststobePaid__c, // please see ACC-5639 if changing this
  };
};

export const mapToClaimStatus = (status: string): ClaimStatus => {
  for (const claimStatus in ClaimStatus) {
    if (status === ClaimStatus[claimStatus as keyof typeof ClaimStatus]) return status;
  }
  return ClaimStatus.UNKNOWN;
};

const mapToReceivedStatus = (status: string): ReceivedStatus => {
  if (!status?.length) return "Unknown";

  const allowedStatuses: ReceivedStatus[] = ["Received", "Not Received"];
  // Note: Preform positive check as it "could" finish sooner
  const hasMatchingStatus = allowedStatuses.some(statusToCheck => statusToCheck === status);

  if (!hasMatchingStatus) return "Unknown";

  return status as ReceivedStatus;
};
