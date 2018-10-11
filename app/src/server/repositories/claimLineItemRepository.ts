import SalesforceBase from "./salesforceBase";
import {RecordTypeRepository} from "./recordTypeRepository";

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
  delete(ids: [ string ]): Promise<void>;
  update(lineItems: Partial<ISalesforceClaimLineItem>[]): Promise<void>;
  insert(lineItems: Partial<ISalesforceClaimLineItem>[]): Promise<string[]>;
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

  delete(ids: string[]): Promise<void>  {
    return super.delete(ids);
  }

  update(lineItems: (Partial<ISalesforceClaimLineItem> & { Id: string })[]): Promise<void>  {
    return super.update(lineItems);
  }

  insert(lineItems: Partial<ISalesforceClaimLineItem>[]): Promise<string[]>  {
    return new RecordTypeRepository().getAll()
      .then(types => {
        const type = types.find(x => x.Name === this.recordType && x.SobjectType === this.objectName);
        if (!type) {
          throw Error("Failed to find claim line item record type");
        }
        return type.Id;
      })
      .then(typeId => lineItems.map(item => ({ ...item, RecordTypeId: typeId })))
      .then(itemsToInsert => super.insert(itemsToInsert));
  }
}
