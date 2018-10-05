import SalesforceBase from "./salesforceBase";

export interface ISalesforceProfileDetails {
  Acc_CostCategory__c: string;
  Acc_PeriodCostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
  Acc_ProjectPeriodId__c: number;
}

const fields = [
  "Acc_CostCategory__c",
  "Acc_PeriodCostCategoryTotal__c",
  "Acc_ProjectParticipant__c",
  "Acc_ProjectPeriodId__c",
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

  getAllByPartnerWithPeriodGt(partnerId: string, periodId: number): Promise<ISalesforceProfileDetails[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_ProjectPeriodId__c > ${periodId}`;
    return super.whereString(filter);
  }
}
