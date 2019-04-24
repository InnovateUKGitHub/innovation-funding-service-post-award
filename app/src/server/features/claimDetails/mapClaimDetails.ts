import { ISalesforceClaimDetails } from "@server/repositories";
import { SALESFORCE_DATE_FORMAT } from "@server/features/common";
import { IContext } from "@framework/types";

export function mapClaimDetails(salesforceClaimDetails: ISalesforceClaimDetails, context: IContext): ClaimDetailsDto {
  return ({
    id: salesforceClaimDetails.Id,
    periodId: salesforceClaimDetails.Acc_ProjectPeriodNumber__c,
    periodStart: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodStartDate__c, SALESFORCE_DATE_FORMAT),
    periodEnd: context.clock.parse(salesforceClaimDetails.Acc_ProjectPeriodEndDate__c, SALESFORCE_DATE_FORMAT),
    costCategoryId: salesforceClaimDetails.Acc_CostCategory__c,
    value: salesforceClaimDetails.Acc_PeriodCostCategoryTotal__c,
    comments: salesforceClaimDetails.Acc_ReasonForDifference__c,
  });
}
