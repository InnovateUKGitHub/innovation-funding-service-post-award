import { QueryBase } from "../common/queryBase";
import { IContext } from "@framework/types";

export class GetCostCategoriesQuery extends QueryBase<CostCategoryDto[]> {
  protected async Run(context: IContext) {
    return context.caches.costCategories.fetchAsync("All", () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const data = await context.repositories.costCategories.getAll();

    data.sort((a, b) => a.Acc_DisplayOrder__c - b.Acc_DisplayOrder__c);

    return data.map<CostCategoryDto>(x => ({
      id: x.Id,
      name: x.Acc_CostCategoryName__c,
      competitionType: x.Acc_CompetitionType__c,
      organisationType: x.Acc_OrganisationType__c,
      // TODO get from SF -- this is nasty but no solution provided as yet from salesforce
      isCalculated: x.Acc_CostCategoryName__c === "Overheads",
      hasRelated: x.Acc_CostCategoryName__c === "Labour",
      description: x.Acc_CostCategoryDescription__c,
      hintText: x.Acc_HintText__c
    }));
  }
}
