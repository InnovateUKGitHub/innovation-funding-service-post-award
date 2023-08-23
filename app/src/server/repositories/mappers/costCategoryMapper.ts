import { CostCategoryType } from "@framework/constants/enums";
import { CostCategory } from "@framework/entities/costCategory";
import { CostCategoryList } from "@framework/types/CostCategory";
import { ISalesforceCostCategory } from "../costCategoriesRepository";
import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class SalesforceCostCategoryMapper extends SalesforceBaseMapper<ISalesforceCostCategory, CostCategory> {
  private typeMapper(costCategory: ISalesforceCostCategory): CostCategoryType {
    // Academic cost categories are always Academic.
    if (costCategory.Acc_OrganisationType__c === "Academic") {
      return CostCategoryType.Academic;
    }

    return new CostCategoryList().fromName(costCategory.Acc_CostCategoryName__c).id;
  }

  public map(x: ISalesforceCostCategory): CostCategory {
    const type = this.typeMapper(x);
    return {
      id: x.Id as CostCategoryId,
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
