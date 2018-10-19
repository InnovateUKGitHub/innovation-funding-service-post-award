import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaimDetails {
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

type FieldNames = keyof ISalesforceClaimDetails;

const fields: FieldNames[] = [
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
  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]>;
}

export class ClaimDetailsRepository extends SalesforceBase<ISalesforceClaimDetails> implements IClaimDetailsRepository {
  private recordType: string = "Claims Detail";

  constructor() {
    super("Acc_Claims__c", fields);
  }

  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c = ${periodId}`;
    return super.whereString(filter);
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
