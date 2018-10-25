import SalesforceBase from "./salesforceBase";
import { Connection } from "jsforce";

export interface ISalesforceClaimDetails {
  Id: string;
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

type FieldNames = keyof ISalesforceClaimDetails;

const fields: FieldNames[] = [
  "Id",
  "Acc_CostCategory__c",
  "Acc_PeriodCostCategoryTotal__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_ProjectPeriodStartDate__c",
  "Acc_ProjectPeriodEndDate__c",
];

export interface IClaimDetailsRepository {
  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
  getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
  get(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceClaimDetails>;
  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]>;
}

export class ClaimDetailsRepository extends SalesforceBase<ISalesforceClaimDetails> implements IClaimDetailsRepository {
  private recordType: string = "Claims Detail";

  constructor(connection: () => Promise<Connection>) {
    super(connection, "Acc_Claims__c", fields);
  }

  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c = ${periodId}`;
    return super.whereString(filter);
  }

  async get(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceClaimDetails> {
    const filter = `
    Acc_ProjectParticipant__c = '${partnerId}'
    AND RecordType.Name = '${this.recordType}'
    AND Acc_ProjectPeriodNumber__c = ${periodId}
    AND Acc_CostCategory__c = '${costCategoryId}'
    `;
    const claimDetail = await super.filterOne(filter);
    if (!claimDetail ) {
      throw Error("Claim detail not found");
    }
    return claimDetail;
  }

  getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c < ${periodId}`;
    return super.whereString(filter);
  }

  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.whereString(filter);
  }
}
