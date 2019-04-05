import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceClaimDetails {
  Id: string;
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

export interface IClaimDetailsRepository {
  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
  getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]>;
  get(key: ClaimDetailKey): Promise<ISalesforceClaimDetails|null>;
  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]>;
}

export class ClaimDetailsRepository extends SalesforceRepositoryBase<ISalesforceClaimDetails> implements IClaimDetailsRepository {

  private readonly recordType: string = "Claims Detail";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategory__c",
    "Acc_PeriodCostCategoryTotal__c",
    "Acc_ProjectParticipant__c",
    "Acc_ProjectPeriodNumber__c",
    "Acc_ProjectPeriodStartDate__c",
    "Acc_ProjectPeriodEndDate__c",
  ];

  getAllByPartnerForPeriod(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
      AND Acc_ClaimStatus__c != 'New'
    `;
    return super.where(filter);
  }

  async get(claimDetailKey: ClaimDetailKey): Promise<ISalesforceClaimDetails|null> {
    const { partnerId, periodId, costCategoryId } = claimDetailKey;
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c = ${periodId}
      AND Acc_CostCategory__c = '${costCategoryId}'
      AND Acc_ClaimStatus__c != 'New'
    `;
    return await super.filterOne(filter);
  }

  getAllByPartnerWithPeriodLt(partnerId: string, periodId: number): Promise<ISalesforceClaimDetails[]> {
    const filter = `
      Acc_ProjectParticipant__c = '${partnerId}'
      AND RecordType.Name = '${this.recordType}'
      AND Acc_ProjectPeriodNumber__c < ${periodId}
      AND Acc_ClaimStatus__c != 'New'
    `;
    return super.where(filter);
  }

  getAllByPartner(partnerId: string): Promise<ISalesforceClaimDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ClaimStatus__c != 'New'`;
    return super.where(filter);
  }
}
