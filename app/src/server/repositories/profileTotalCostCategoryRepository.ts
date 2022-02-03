import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceProfileTotalCostCategory {
  Id: string;
  Acc_CostCategory__c: string;
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
 * Stored in "Acc_Profile__c" table with record type of "Total Cost Category"
 *
 * @todo - Deprecate class and favour -> ProfileDetailsRepository as it already uses the same Table in SF (getAllByPartnerId() can be replaced with getRequiredCategories()), make sure we migrate "Acc_CostCategoryGOLCost__c" to the other repository
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
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}' AND Acc_CostCategory__c != null`;
    return super.where(filter);
  }
}
