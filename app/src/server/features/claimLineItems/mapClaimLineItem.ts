import {ISalesforceClaimLineItem} from "../../repositories";
import { IContext } from "../../../types/IContext";

export default (context: IContext) => (item: ISalesforceClaimLineItem): ClaimLineItemDto => ({
  id: item.Id,
  description: item.Acc_LineItemDescription__c,
  value: item.Acc_LineItemCost__c,
  partnerId: item.Acc_ProjectParticipant__c,
  periodId: item.Acc_ProjectPeriodNumber__c,
  costCategoryId: item.Acc_CostCategory__c
});
