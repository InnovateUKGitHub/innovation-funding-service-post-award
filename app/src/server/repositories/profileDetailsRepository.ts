import SalesforceBase from "./salesforceBase";

export interface ISalesforceProfileDetails {
  Acc_CostCategory__c: string;
  Acc_LatestForecastCost__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
}

const fields = [
  "Acc_CostCategory__c",
  // "Acc_PeriodCostCategoryTotal__c",
  "Acc_LatestForecastCost__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodNumber__c",
];

export interface IProfileDetailsRepository {
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]>;
  getById(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceProfileDetails>;
}

export class ProfileDetailsRepository extends SalesforceBase<ISalesforceProfileDetails> implements IProfileDetailsRepository {
  private recordType: string = "Profile Detail";

  constructor() {
    super("Acc_Profile__c", fields);
  }

  public async getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]> {
    // const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c >= ${periodId}`;
    // return await super.whereString(filter);

    // TODO - remove faker
    return this.createFake(partnerId, periodId);
  }

  public async getById(partnerId: string, periodId: number, costCategoryId: string): Promise<ISalesforceProfileDetails> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c >= ${periodId} AND Acc_CostCategory__c = '${costCategoryId}'`;
    return await super.whereString(filter).then((res) => res[0]);
  }

  private createFake(partnerId: string, periodId: number): ISalesforceProfileDetails[] {
    return [{
      Acc_CostCategory__c: "a071X000000HHZtQAO",
      Acc_LatestForecastCost__c: 10000,
      Acc_ProjectParticipant__c: partnerId,
      Acc_ProjectPeriodNumber__c: periodId
    }];
  }
}
