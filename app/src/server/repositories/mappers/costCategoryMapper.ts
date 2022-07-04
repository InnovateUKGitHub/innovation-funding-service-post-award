import { CostCategoryName, CostCategoryType } from "@framework/constants";
import { CostCategory } from "@framework/entities";
import { ISalesforceCostCategory } from "../costCategoriesRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforceCostCategoryMapper extends SalesforceBaseMapper<ISalesforceCostCategory, CostCategory> {
  private typeMapper(costCategory: ISalesforceCostCategory): CostCategoryType {
    if (costCategory.Acc_OrganisationType__c === CostCategoryName.Academic.valueOf()) {
      return CostCategoryType.Academic;
    }
    // @TODO: get from SF -- this is nasty but no solution provided as yet from salesforce
    switch (costCategory.Acc_CostCategoryName__c) {
      case CostCategoryName.Other_Public_Sector_Funding:
        return CostCategoryType.Other_Funding;
      case CostCategoryName.Labour:
        return CostCategoryType.Labour;
      case CostCategoryName.Overheads:
        return CostCategoryType.Overheads;
      case CostCategoryName.Materials:
        return CostCategoryType.Materials;
      case CostCategoryName.Capital_Usage:
        return CostCategoryType.Capital_Usage;
      case CostCategoryName.Subcontracting:
        return CostCategoryType.Subcontracting;
      case CostCategoryName.Travel_And_Subsistence:
        return CostCategoryType.Travel_And_Subsistence;
      case CostCategoryName.Other_Costs:
        return CostCategoryType.Other_Costs;
      default:
        return CostCategoryType.Unknown;
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
      isCalculated: false,
      hasRelated: false,
      description: x.Acc_CostCategoryDescription__c,
      hintText: x.Acc_HintText__c,
      displayOrder: x.Acc_DisplayOrder__c,
      overrideAwardRate: x.Acc_OverrideAwardRate__c,
    };
  }
}
