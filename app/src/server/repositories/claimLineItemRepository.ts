import SalesforceRepositoryBase, {Updatable} from "./salesforceRepositoryBase";
import {RecordTypeRepository} from "./recordTypeRepository";

export interface ISalesforceClaimLineItem {
  Id: string;
  Acc_LineItemDescription__c: string;
  Acc_LineItemCost__c: number;
  Acc_CostCategory__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectParticipant__c: string;
  RecordTypeId: string;
}

export interface IClaimLineItemRepository {
  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]>;
  delete(ids: string[] | string): Promise<void>;
  update(update: Updatable<ISalesforceClaimLineItem>[] | Updatable<ISalesforceClaimLineItem>): Promise<boolean>;
  insert(insert: Partial<ISalesforceClaimLineItem>[] | Partial<ISalesforceClaimLineItem>): Promise<string[]> | Promise<string>;
}

export class ClaimLineItemRepository extends SalesforceRepositoryBase<ISalesforceClaimLineItem> implements IClaimLineItemRepository {
  private readonly recordType: string = "Claims Line Item";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_LineItemDescription__c",
    "Acc_LineItemCost__c",
    "Acc_CostCategory__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectParticipant__c"
  ];

  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
      AND Acc_CostCategory__c = '${categoryId}'
      AND RecordType.Name = '${this.recordType}'
    `;
    return super.where(filter);
  }

  delete(ids: string[] | string): Promise<void>  {
    return super.delete(ids);
  }

  update(lineItems: (Updatable<ISalesforceClaimLineItem>)[] | Updatable<ISalesforceClaimLineItem>): Promise<boolean>  {
    return super.update(lineItems);
  }

  async insert(insert: Partial<ISalesforceClaimLineItem>): Promise<string>;
  async insert(insert: Partial<ISalesforceClaimLineItem>[]): Promise<string[]>;
  async insert(insert: Partial<ISalesforceClaimLineItem>[] | Partial<ISalesforceClaimLineItem>) {
    // ToDo: should this be cached?
    const types = await new RecordTypeRepository(this.getSalesforceConnection).getAll();
    const type = types.find(x => x.Name === this.recordType && x.SobjectType === this.salesforceObjectName);
    if (!type) {
      throw Error("Failed to find claim line item record type");
    }
    if (insert instanceof Array) {
      return super.insert(insert.map(item => ({...item, RecordTypeId: type.Id})));
    }
    return super.insert({...insert, RecordTypeId: type.Id});
  }
}
