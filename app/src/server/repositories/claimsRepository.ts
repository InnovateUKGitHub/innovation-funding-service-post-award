import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
}

const fields = [
  "Id",
  "Acc_ProjectParticipant__c"
];

export interface IClaimRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
}

// TODO delete once Salesforce fields are available
const extendData = (data: any): ISalesforceClaim => {
  return data && {
    ...data,
    Acc_TotalParticipantGrant__c: 100000,
    Acc_TotalParticipantCosts__c: 50000,
    Acc_TotalParticipantCostsPaid__c: 30000,
    Acc_PercentageParticipantCosts__c: 50,
    Acc_CapLimit__c: 85,
    Acc_AwardRate__c: 50,
  };
};

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
  constructor() {
    super("Acc_Claims__c", fields);
  }

  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    return super.whereFilter(x => x.Acc_ProjectParticipant__c
      = partnerId)
    // TODO delete once Salesforce fields are available
      // .then(results => results.map(extendData));
  }
}
