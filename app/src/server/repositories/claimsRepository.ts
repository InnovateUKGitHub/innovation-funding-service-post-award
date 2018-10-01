import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  Acc_ClaimStatus__c: string;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodID__c: number;
  Acc_TotalCost__c: number;
  Acc_TotalCostsApproved__c: number;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalGrantApproved__c: number;
  // TODO replace with value from costs object
  Acc_ForecastCost__c: number;
  // TODO get real field names when available
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
  Acc_LineItemDescription__c: string | null;
}

const fields = [
  "Id",
  "Acc_ProjectParticipant__c",
  "LastModifiedDate",
  "Acc_ClaimStatus__c",
  "Acc_ProjectPeriodStartDate__c",
  "Acc_ProjectPeriodEndDate__c",
  "Acc_ProjectPeriodID__c",
  // "Acc_ForecastCost__c",
  "Acc_TotalCost__c",
  "Acc_ApprovedDate__c",
  "Acc_PaidDate__c",
  "Acc_LineItemDescription__c"
];

export interface IClaimRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  getByPartnerIdAndPeriodId(partnerId: string, periodId: number): Promise<ISalesforceClaim|null>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
  private recordType = "Total Project Period";
  constructor() {
    super("Acc_Claims__c", fields);
  }

  extend(item: ISalesforceClaim|null) {
    if(!item) {
      return item;
    }
    item.Acc_ForecastCost__c = 10000;
    return item;
  }

  public async getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    const result = await super.whereString(filter).then(x => x.map(y => this.extend(y)!));
    // todo remove fake
    if(!result.length){
      return [this.createFake(partnerId, 1)];
    }
    return result;
  }

  public async getByPartnerIdAndPeriodId(partnerId: string, periodId: number) {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND Acc_ProjectPeriodID__c = ${periodId} AND RecordType.Name = '${this.recordType}'`;
    const result = await super.whereString(filter).then(x => x.map(y => this.extend(y)!)).then(x => x[0]);
    // todo remove fake
    if(!result){
      return this.createFake(partnerId, periodId);
    }
    return result;
  }

  private createFake(partnerId: string, periodId: number): ISalesforceClaim {
    return ({
      Acc_ApprovedDate__c: null,
      Acc_ClaimStatus__c: "Draft",
      Acc_ForecastCost__c: 10000,
      Acc_PaidDate__c: null,
      Acc_ProjectParticipant__c: partnerId,
      Acc_ProjectPeriodEndDate__c: "2108-09-30",
      Acc_ProjectPeriodID__c: periodId,
      Acc_ProjectPeriodStartDate__c: "2108-07-01",
      Acc_TotalCost__c: 1000,
      Acc_TotalCostsApproved__c: 1100,
      Acc_TotalCostsSubmitted__c: 1200,
      Acc_TotalGrantApproved__c: 1300,
      Id: "xxxxxx",
      LastModifiedDate: "2018-10-01T10:13:47.000+0000",
      Acc_LineItemDescription__c: "An example that isnt in the store"
    });
  }

  public update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }) {
    return this.updateOne(updatedClaim);
  }
}
