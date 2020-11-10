import { ISalesforceClaimLineItem } from "@server/repositories";
import { ClaimLineItemDto, IContext } from "@framework/types";

export default (context: IContext) => (item: ISalesforceClaimLineItem): ClaimLineItemDto => ({
  id: item.Id,
  description: item.Acc_LineItemDescription__c,
  value: item.Acc_LineItemCost__c,
  partnerId: item.Acc_ProjectParticipant__c,
  periodId: item.Acc_ProjectPeriodNumber__c,
  costCategoryId: item.Acc_CostCategory__c,
  lastModifiedDate: context.clock.parseRequiredSalesforceDateTime(item.LastModifiedDate),
});
