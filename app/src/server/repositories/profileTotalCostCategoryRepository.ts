import SalesforceBase from "./salesforceBase";

export interface ISalesforceProfileTotalCostCategory {
  Acc_CostCategory__c: string;
  // Acc_CostCategoryTotal__c: number;
  Acc_CostCategoryGOLCost__c: number;
  Acc_ProjectParticipant__c: string;
}

type FieldNames = keyof ISalesforceProfileTotalCostCategory;

const fields: FieldNames[] = [
  "Acc_CostCategory__c",
  // "Acc_CostCategoryTotal__c",
  "Acc_CostCategoryGOLCost__c",
  "Acc_ProjectParticipant__c",
];

export interface IProfileTotalCostCategoryRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalCostCategory[]>;
}

export class ProfileTotalCostCategoryRepository extends SalesforceBase<ISalesforceProfileTotalCostCategory> implements IProfileTotalCostCategoryRepository {
  private recordType: string = "Total Cost Category";

  constructor() {
    super("Acc_Profile__c", fields);
  }

  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalCostCategory[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.whereString(filter);
  }
}
