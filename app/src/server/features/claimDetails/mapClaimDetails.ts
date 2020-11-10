import { ISalesforceClaimDetails, ISalesforceClaimLineItem } from "@server/repositories";
import { SALESFORCE_DATE_FORMAT } from "@server/features/common";
import { ClaimDetailsDto, ClaimDetailsSummaryDto, IContext } from "@framework/types";
import mapClaimLineItem from "@server/features/claimDetails/mapClaimLineItem";

export function mapClaimDetailsSummary(salesforceClaimDetails: ISalesforceClaimDetails, context: IContext): ClaimDetailsSummaryDto {
  return ({
    partnerId: salesforceClaimDetails.Acc_ProjectParticipant__r.Id,
    periodId: salesforceClaimDetails.Acc_ProjectPeriodNumber__c,
    periodStart: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT),
    periodEnd: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT),
    costCategoryId: salesforceClaimDetails.Acc_CostCategory__c,
    value: salesforceClaimDetails.Acc_PeriodCostCategoryTotal__c,
    comments: salesforceClaimDetails.Acc_ReasonForDifference__c
  });
}

export function mapClaimDetails(salesforceClaimDetails: ISalesforceClaimDetails, salesforceLineItems: ISalesforceClaimLineItem[], context: IContext): ClaimDetailsDto {
  return ({
    ...mapClaimDetailsSummary(salesforceClaimDetails, context),
    lineItems: salesforceLineItems.map(mapClaimLineItem(context))
  });
}
