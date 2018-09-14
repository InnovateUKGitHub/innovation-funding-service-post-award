import SalesforceBase from "./salesforceBase";

export interface ISalesforceClaim {
  Id: string;
  Acc_ProjectParticipant__c: string;
  LastModifiedDate: string;
  Acc_ClaimStatus__c: string;
  Acc_ProjectPeriodStartDate_c: string;
  Acc_ProjectPeriodEndDate__c: string;
  Acc_ProjectPeriodID__c: string;
  Acc_TotalCost__c: number;
  // TODO replace with value from costs object
  Acc_ForecastCost__c: number;
  // TODO get real field names when available
  Acc_ApprovedDate__c: string | null;
  Acc_PaidDate__c: string | null;
}

const fields = [
  "Id",
  "Acc_ProjectParticipant__c",
  "LastModifiedDate",
  "Acc_ClaimStatus__c",
  "Acc_ProjectPeriodStartDate_c",
  "Acc_ProjectPeriodEndDate__c",
  "Acc_ProjectPeriodID__c",
  "Acc_ForecastCost__c",
  "Acc_TotalCost__c",
  "Acc_ApprovedDate__c",
  "Acc_PaidDate__c",
];

export interface IClaimRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]>;
}

export class ClaimRepository extends SalesforceBase<ISalesforceClaim> implements IClaimRepository {
  constructor() {
    super("Acc_Claims__c", fields);
  }

  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaim[]> {
    // return super.whereFilter(x => x.Acc_ProjectParticipant__c = partnerId);

    // TODO remove stubbed data
    return Promise.resolve([
      {
        Id: "1234567892",
        Acc_ProjectParticipant__c: partnerId,
        LastModifiedDate: "2018-09-14",
        Acc_ClaimStatus__c: "Submitted",
        Acc_ProjectPeriodStartDate_c: "2018-08-01",
        Acc_ProjectPeriodEndDate__c: "2018-11-30",
        Acc_ProjectPeriodID__c: "P3",
        Acc_TotalCost__c: 82382,
        Acc_ForecastCost__c: 85012,
        Acc_ApprovedDate__c: null,
        Acc_PaidDate__c: null
      },{
        Id: "1234567891",
        Acc_ProjectParticipant__c: partnerId,
        LastModifiedDate: "2018-07-14",
        Acc_ClaimStatus__c: "Approved",
        Acc_ProjectPeriodStartDate_c: "2018-05-01",
        Acc_ProjectPeriodEndDate__c: "2018-07-31",
        Acc_ProjectPeriodID__c: "P2",
        Acc_TotalCost__c: 62100,
        Acc_ForecastCost__c: 60000,
        Acc_ApprovedDate__c: "2018-08-15",
        Acc_PaidDate__c: null
      },{
        Id: "1234567890",
        Acc_ProjectParticipant__c: partnerId,
        LastModifiedDate: "2018-07-14",
        Acc_ClaimStatus__c: "Paid",
        Acc_ProjectPeriodStartDate_c: "2018-02-01",
        Acc_ProjectPeriodEndDate__c: "2018-04-30",
        Acc_ProjectPeriodID__c: "P1",
        Acc_TotalCost__c: 104440,
        Acc_ForecastCost__c: 95000,
        Acc_ApprovedDate__c: "2018-05-15",
        Acc_PaidDate__c: "2018-05-25"
      }
    ]);
  }
}
