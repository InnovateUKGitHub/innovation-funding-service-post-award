import { ILogger } from "@shared/developmentLogger";
import { sss } from "@server/util/salesforce-string-helpers";
import { Connection } from "jsforce";
import SalesforceRepositoryBase, { Updatable } from "./salesforceRepositoryBase";

export interface ISalesforceClaimLineItem {
  Id: string;
  Acc_LineItemDescription__c: string;
  Acc_LineItemCost__c: number;
  Acc_CostCategory__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  RecordTypeId: string;
  Owner: {
    Email: string;
  };
}

export interface IClaimLineItemRepository {
  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]>;
  delete(ids: string[]): Promise<void>;
  update(update: Updatable<ISalesforceClaimLineItem>[]): Promise<boolean>;
  insert(insert: Partial<ISalesforceClaimLineItem>[]): Promise<string[]>;
}

/**
 * Claim line items are from the Acc_Claims__c table at the "Claims Line Item" level.
 *
 * Claim information that makes up a claim detail stored against a cost category and claim
 *
 * A number of claim line item records are summed to make a claim detail
 */
export class ClaimLineItemRepository
  extends SalesforceRepositoryBase<ISalesforceClaimLineItem>
  implements IClaimLineItemRepository
{
  constructor(
    private readonly getRecordTypeId: (objectName: string, recordType: string) => Promise<string>,
    getSalesforceConnection: () => Promise<Connection>,
    logger: ILogger,
  ) {
    super(getSalesforceConnection, logger);
  }

  private readonly recordType: string = "Claims Line Item";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_LineItemDescription__c",
    "Acc_LineItemCost__c",
    "Acc_CostCategory__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectParticipant__c",
    "Owner.Email",
    "LastModifiedDate",
  ];

  getAllForCategory(partnerId: string, categoryId: string, periodId: number): Promise<ISalesforceClaimLineItem[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${sss(partnerId)}'
      AND Acc_ProjectPeriodNumber__c = ${sss(periodId)}
      AND Acc_CostCategory__c = '${sss(categoryId)}'
      AND RecordType.Name = '${sss(this.recordType)}'
    `;
    return super.where(filter);
  }

  delete(ids: string[]): Promise<void> {
    return super.deleteAll(ids);
  }

  update(lineItems: Updatable<ISalesforceClaimLineItem>[]): Promise<boolean> {
    return super.updateAll(lineItems);
  }

  async insert(insert: Partial<ISalesforceClaimLineItem>[]) {
    const RecordTypeId = await this.getRecordTypeId(this.salesforceObjectName, this.recordType);
    return super.insertAll(insert.map(item => Object.assign({}, item, { RecordTypeId })));
  }
}
