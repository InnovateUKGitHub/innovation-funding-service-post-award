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
