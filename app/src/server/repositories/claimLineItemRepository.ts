import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimLineItem {
  Id: string;
  Acc_LineItemDescription__c: string;
  Acc_LineItemCost__c: number;
  Acc_CostCategory__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectParticipant__c: string;
}

const fields = [
  "Id",
  "Acc_LineItemDescription__c",
  "Acc_LineItemCost__c",
  "Acc_CostCategory__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_ProjectParticipant__c"
];

export interface IClaimLineItemRepository {
  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]>;
}

export class ClaimLineItemRepository extends SalesforceBase<ISalesforceClaimLineItem> implements IClaimLineItemRepository {

  private recordType: string = "Claims Line Item";

  constructor() {
    super("Acc_Claims__c", fields);
  }

  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]> {
    // TODO review which ID is used for cost category
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
      AND Acc_CostCategory__c = '${categoryId}'
      AND RecordType.Name = '${this.recordType}'
    `;
    return super.whereString(filter);
  }
}
