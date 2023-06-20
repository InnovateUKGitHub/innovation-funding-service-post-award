import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { IContext } from "@framework/types/IContext";
import { ISalesforceClaimLineItem } from "@server/repositories/claimLineItemRepository";

export default (context: IContext) =>
  (item: ISalesforceClaimLineItem): ClaimLineItemDto => ({
    id: item.Id,
    description: item.Acc_LineItemDescription__c,
    value: item.Acc_LineItemCost__c,
    partnerId: item.Acc_ProjectParticipant__c as PartnerId,
    periodId: item.Acc_ProjectPeriodNumber__c as PeriodId,
    costCategoryId: item.Acc_CostCategory__c,
    lastModifiedDate: context.clock.parseRequiredSalesforceDateTime(item.LastModifiedDate),
    isAuthor:
      context.user.email === context.config.salesforceServiceUser.serviceUsername ||
      item.Owner.Email === context.user.email,
  });
