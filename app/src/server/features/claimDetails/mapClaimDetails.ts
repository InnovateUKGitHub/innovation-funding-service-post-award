import { ISalesforceClaimDetails, ISalesforceClaimLineItem } from "@server/repositories";
import { salesforceDateFormat } from "@framework/util/clock";
import { ClaimDetailsDto, ClaimDetailsSummaryDto, IContext } from "@framework/types";
import mapClaimLineItem from "@server/features/claimDetails/mapClaimLineItem";

/**
 * mapper function for `mapClaimDetails`
 */
export function mapClaimDetailsSummary(
  salesforceClaimDetails: ISalesforceClaimDetails,
  context: IContext,
): ClaimDetailsSummaryDto {
  return {
    partnerId: salesforceClaimDetails.Acc_ProjectParticipant__r.Id,
    periodId: salesforceClaimDetails.Acc_ProjectPeriodNumber__c,
    periodStart: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodStartDate__c, salesforceDateFormat),
    periodEnd: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodEndDate__c, salesforceDateFormat),
    costCategoryId: salesforceClaimDetails.Acc_CostCategory__c,
    value: salesforceClaimDetails.Acc_PeriodCostCategoryTotal__c,
    comments: salesforceClaimDetails.Acc_ReasonForDifference__c,
    isAuthor:
      context.user.email === context.config.salesforceServiceUser.serviceUsername ||
      salesforceClaimDetails.Owner.Email === context.user.email,
  };
}

/**
 * maps claimDetails from salesforce to js standard
 */
export function mapClaimDetails(
  salesforceClaimDetails: ISalesforceClaimDetails,
  salesforceLineItems: ISalesforceClaimLineItem[],
  context: IContext,
): ClaimDetailsDto {
  return {
    ...mapClaimDetailsSummary(salesforceClaimDetails, context),
    lineItems: salesforceLineItems.map(mapClaimLineItem(context)),
  };
}
