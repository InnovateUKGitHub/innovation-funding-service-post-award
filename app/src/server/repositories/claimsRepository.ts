import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  Acc_ClaimStatus__c: string;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodID__c: string;
  Acc_TotalCost__c: number;
  Acc_TotalCostsApproved__c: number;
  Acc_TotalCostsSubmitted__c: number;
  Acc_TotalGrantApproved__c: number;
  // TODO replace with value from costs object
  Acc_ForecastCost__c: number;
  // TODO get real field names when available
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
  RecordType: {
    Name: string;
  };
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
  "Acc_PaidDate__c"
];

export interface IClaimRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
  getById(claimId: string): Promise<ISalesforceClaim|null>;
  update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }): Promise<boolean>;
}

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
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

  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = 'Claims Header'`;
    return super.whereString(filter).then(x => x.map(y => this.extend(y)!));
  }

  public getById(claimId: string) {
    return super.retrieve(claimId).then(x => this.extend(x));
  }

  public update(updatedClaim: Partial<ISalesforceClaim> & { Id: string }) {
    return this.updateOne(updatedClaim);
  }
}
