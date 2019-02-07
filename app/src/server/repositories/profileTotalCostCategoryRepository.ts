import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceProfileTotalCostCategory {
  Id: string;
  Acc_CostCategory__c: string;
  // Acc_CostCategoryTotal__c: number;
  Acc_CostCategoryGOLCost__c: number;
  Acc_ProjectParticipant__c: string;
}

export interface IProfileTotalCostCategoryRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalCostCategory[]>;
}

export class ProfileTotalCostCategoryRepository extends SalesforceRepositoryBase<ISalesforceProfileTotalCostCategory> implements IProfileTotalCostCategoryRepository {

  private readonly recordType: string = "Total Cost Category";

  protected readonly salesforceObjectName = "Acc_Profile__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategory__c",
    // "Acc_CostCategoryTotal__c",
    "Acc_CostCategoryGOLCost__c",
    "Acc_ProjectParticipant__c",
  ];

  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalCostCategory[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }
}
