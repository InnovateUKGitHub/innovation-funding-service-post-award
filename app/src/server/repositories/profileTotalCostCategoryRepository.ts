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

/**
 * Forecast Total for partner per cost category
 *
 * ie amount a partner expects to spend in that cost category for the hole project calculated from the detail for that period
 * Effectively holds the grant letter offer for each cost category
 *
 * Stored in "Acc_Profile__c" table with record type of "Total Cost Category"
 */
export class ProfileTotalCostCategoryRepository extends SalesforceRepositoryBase<ISalesforceProfileTotalCostCategory> implements IProfileTotalCostCategoryRepository {

  private readonly recordType: string = "Total Cost Category";

  protected readonly salesforceObjectName = "Acc_Profile__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategory__c",
    "Acc_CostCategoryGOLCost__c",
    "Acc_ProjectParticipant__c",
  ];

  getAllByPartnerId(partnerId: string): Promise<ISalesforceProfileTotalCostCategory[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }
}
