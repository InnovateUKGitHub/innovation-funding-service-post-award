import SalesforceRepositoryBase from "./salesforceRepositoryBase";

export interface ISalesforceClaimTotalCostCategory {
  Acc_CostCategory__c: string;
  Acc_CostCategoryTotal__c: number;
  Acc_ProjectParticipant__c: string;
}

export interface IClaimTotalCostCategoryRepository {
  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]>;
}

/**
 * ClaimTotalCostCategory are from the Acc_Claims__c table at the "Total Cost Category" level.
 *
 * The total claimed for a given cost category across the project summed from the claim details for the cost category and project
 * 
 * This is the total **claimed** not the total **approved**
 */
export class ClaimTotalCostCategoryRepository extends SalesforceRepositoryBase<ISalesforceClaimTotalCostCategory> implements IClaimTotalCostCategoryRepository {

  private readonly recordType: string = "Total Cost Category";

  protected readonly salesforceObjectName = "Acc_Claims__c";

  protected readonly salesforceFieldNames = [
    "Acc_CostCategory__c",
    "Acc_CostCategoryTotal__c",
    "Acc_ProjectParticipant__c",
  ];

  getAllByPartnerId(partnerId: string): Promise<ISalesforceClaimTotalCostCategory[]> {
    const filter = `Acc_ProjectParticipant__c = '${partnerId}' AND RecordType.Name = '${this.recordType}'`;
    return super.where(filter);
  }
}
