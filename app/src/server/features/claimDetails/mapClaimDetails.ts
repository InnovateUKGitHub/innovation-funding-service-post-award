import { salesforceDateFormat } from "@framework/util/clock";
import mapClaimLineItem from "@server/features/claimDetails/mapClaimLineItem";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { ClaimDetailsSummaryDto, ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { IContext } from "@framework/types/IContext";
import { ISalesforceClaimDetails } from "@server/repositories/claimDetailsRepository";
import { ISalesforceClaimLineItem } from "@server/repositories/claimLineItemRepository";

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
    grantPaidToDate: salesforceClaimDetails.Acc_Grant_Paid_To_Date__c,
    impactManagementParticipation: mapImpactManagementParticipationToEnum(
      salesforceClaimDetails.Impact_Management_Participation__c,
    ),
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
