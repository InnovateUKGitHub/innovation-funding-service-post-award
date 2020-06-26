import { SalesforceBaseMapper } from "./saleforceMapperBase";
import { ISalesforceCostCategory } from "../costCategoriesRepository";
import { CostCategory, CostCategoryType } from "@framework/entities";

export class SalesforceCostCategoryMapper extends SalesforceBaseMapper<ISalesforceCostCategory, CostCategory> {

  private typeMapper(costCategory: ISalesforceCostCategory): CostCategoryType {
    if (costCategory.Acc_OrganisationType__c === "Academic") {
      return CostCategoryType.Academic;
    }
    // @TODO: get from SF -- this is nasty but no solution provided as yet from salesforce
    switch(costCategory.Acc_CostCategoryName__c) {
      case "Labour": return CostCategoryType.Labour;
      case "Overheads": return CostCategoryType.Overheads;
      case "Materials": return CostCategoryType.Materials;
      case "Capital usage": return CostCategoryType.Capital_Usage;
      case "Subcontracting": return CostCategoryType.Subcontracting;
      case "Travel and subsistence": return CostCategoryType.Travel_And_Subsistence;
      case "Other costs": return CostCategoryType.Other_Costs;
      default: return CostCategoryType.Unknown;
    }
  }

  public map(x: ISalesforceCostCategory): CostCategory {
    const type = this.typeMapper(x);
    return {
      id: x.Id,
      name: x.Acc_CostCategoryName__c,
      type,
      competitionType: x.Acc_CompetitionType__c,
      organisationType: x.Acc_OrganisationType__c,
      isCalculated: type === CostCategoryType.Overheads,
      hasRelated: type === CostCategoryType.Labour,
      description: x.Acc_CostCategoryDescription__c,
      hintText: x.Acc_HintText__c,
      displayOrder: x.Acc_DisplayOrder__c
    };
  }
}
