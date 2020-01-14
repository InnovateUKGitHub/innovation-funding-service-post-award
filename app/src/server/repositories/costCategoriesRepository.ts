import { SalesforceRepositoryBaseWithMapping } from "./salesforceRepositoryBase";
import { CostCategory } from "@framework/entities";
import { SalesforceCostCategoryMapper } from "./mappers/costCategoryMapper";

export interface ISalesforceCostCategory {
  Id: string;
  Acc_CostCategoryName__c: string;
  Acc_DisplayOrder__c: number;
  Acc_OrganisationType__c: string;
  Acc_CompetitionType__c: string;
  Acc_CostCategoryDescription__c: string;
  Acc_HintText__c: string;
}

export interface ICostCategoryRepository {
  getAll(): Promise<CostCategory[]>;
}

/**
 * Cost categories are categories that cost (claims or forecasts) are assigned to
 *
 * Cost categories are applied to a partner based on the Acc_OrganisationType__c of the partner and the Acc_CompetitionType__c of the project
 *
 * There is currently no way of enabling or disabling cost categories which presumably will required at some point?
 */
export class CostCategoryRepository extends SalesforceRepositoryBaseWithMapping<ISalesforceCostCategory, CostCategory> implements ICostCategoryRepository {

  protected readonly salesforceObjectName = "Acc_CostCategory__c";

  protected readonly salesforceFieldNames = [
    "Id",
    "Acc_CostCategoryName__c",
    "Acc_DisplayOrder__c",
    "Acc_OrganisationType__c",
    "Acc_CompetitionType__c",
    "Acc_CostCategoryDescription__c",
    "Acc_HintText__c"
  ];

  protected mapper = new SalesforceCostCategoryMapper();

  getAll() {
    return super.all();
  }
}
