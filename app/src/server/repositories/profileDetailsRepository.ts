import SalesforceBase from "./salesforceBase";

export interface ISalesforceProfileDetails {
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodNumber__c: number;
  Acc_ProjectPeriodStartDate__c: string;
  Acc_ProjectPeriodEndDate__c: string;
}

type FieldNames = keyof ISalesforceProfileDetails;

const fields: FieldNames[] = [
  "Acc_CostCategory__c",
  // "Acc_PeriodCostCategoryTotal__c",
  // "Acc_TotalCostCategoryValue__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodNumber__c",
  "Acc_ProjectPeriodStartDate__c",
  "Acc_ProjectPeriodEndDate__c",
];

export interface IProfileDetailsRepository {
  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]>;
}

export class ProfileDetailsRepository extends SalesforceBase<ISalesforceProfileDetails> implements IProfileDetailsRepository {
  // TODO - confirm recordType
  // private recordType: string = "Claims Detail";

  constructor() {
    super("Acc_Profile__c", fields);
  }

  public async getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]> {
    // const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodNumber__c >= ${periodId}`;
    // return await super.whereString(filter);

    // TODO - remove faker
    return this.createFake(partnerId, periodId);
  }

  private createFake(partnerId: string, periodId: number): ISalesforceProfileDetails[] {
    return [{
      Acc_CostCategory__c: "a071X000000HHZtQAO",
      Acc_PeriodCostCategoryTotal__c: 10000,
      Acc_ProjectParticipant__c: partnerId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_ProjectPeriodStartDate__c: "2018-01-01",
      Acc_ProjectPeriodEndDate__c: "2018-03-30",
    }];
  }
}
