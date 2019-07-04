import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforceCostCategory } from "../costCategoriesRepository";
import { CostCategory } from "@framework/entities";

export class SalesforceCostCategoryMapper extends SalesforceBaseMapper<ISalesforceCostCategory, CostCategory> {
  public map(x: ISalesforceCostCategory): CostCategory {
    return {
      id: x.Id,
      name: x.Acc_CostCategoryName__c,
      competitionType: x.Acc_CompetitionType__c,
      organisationType: x.Acc_OrganisationType__c,
      // TODO get from SF -- this is nasty but no solution provided as yet from salesforce
      isCalculated: x.Acc_CostCategoryName__c === "Overheads",
      hasRelated: x.Acc_CostCategoryName__c === "Labour",
      description: x.Acc_CostCategoryDescription__c,
      hintText: x.Acc_HintText__c,
      displayOrder: x.Acc_DisplayOrder__c
    };
  }
}
