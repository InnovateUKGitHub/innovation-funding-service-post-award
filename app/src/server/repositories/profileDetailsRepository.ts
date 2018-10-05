import SalesforceBase from "./salesforceBase";

export interface ISalesforceProfileDetails {
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
}

const fields = [
  "Acc_CostCategoryID__c",
  // "Acc_PeriodCostCategoryTotal__c",
  "Acc_TotalCostCategoryValue__c",
  "Acc_ProjectParticipant__c",
  "Acc_PeriodID__c",
];

export interface IProfileDetailsRepository {
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]>;
}

export class ProfileDetailsRepository extends SalesforceBase<ISalesforceProfileDetails> implements IProfileDetailsRepository {
  // TODO - confirm recordType
  private recordType: string = "Claims Detail";

  constructor() {
    super("Acc_Profile__c", fields);
  }

  public async getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c > ${periodId}`;
    const result = false;// await super.whereString(filter);

    // TODO - remove faker
    return !result ? this.createFake(partnerId, periodId) : result;
  }

  private createFake(partnerId: string, periodId: number): ISalesforceProfileDetails[] {
    return [{
      Acc_CostCategory__c: "123",
      Acc_PeriodCostCategoryTotal__c: 10000,
      Acc_ProjectParticipant__c: partnerId,
      Acc_ProjectPeriodNumber__c: periodId
    }];
  }
}
