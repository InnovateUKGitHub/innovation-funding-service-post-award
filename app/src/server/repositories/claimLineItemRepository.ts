import SalesforceRepositoryBase, {Updatable} from "./salesforceRepositoryBase";
import {IRecordTypeRepository, RecordTypeRepository} from "./recordTypeRepository";
import { Connection } from "jsforce";

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
  delete(ids: string[]): Promise<void>;
  update(update: Updatable<ISalesforceClaimLineItem>[]): Promise<boolean>;
  insert(insert: Partial<ISalesforceClaimLineItem>[]): Promise<string[]>;
}

export class ClaimLineItemRepository extends SalesforceRepositoryBase<ISalesforceClaimLineItem> implements IClaimLineItemRepository {

  constructor(private recordTypes: IRecordTypeRepository, getSalesforceConnection: () => Promise<Connection>) {
    super(getSalesforceConnection);
  }

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

  delete(ids: string[]): Promise<void>  {
    return super.deleteAll(ids);
  }

  update(lineItems: (Updatable<ISalesforceClaimLineItem>)[]): Promise<boolean>  {
    return super.updateAll(lineItems);
  }

  async insert(insert: Partial<ISalesforceClaimLineItem>[]) {
    const RecordTypeId = await this.recordTypes.get(this.salesforceObjectName, this.recordType).then(x => x.Id);
    return super.insertAll(insert.map(item => Object.assign({}, item, { RecordTypeId })));
  }
}
