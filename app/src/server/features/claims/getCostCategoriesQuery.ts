import { IContext, QueryBase } from "../common/context";
import { ISalesforceCostCategory } from "../../repositories";

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
      competitionType: this.getCompetitionType(x),
      organistionType: this.getOrganisationType(x),
      isCalculated: x.Acc_CostCategoryName__c === "Overheads",
      description: x.Acc_CostCategoryDescription__c,
      hintText: x.Acc_HintText__c
    }));
  }

  private getOrganisationType(item: ISalesforceCostCategory) {
    if (item.Acc_OrganisationType__c === "Academic") {
      return "Academic";
    }
    else if (item.Acc_OrganisationType__c === "Industrial") {
      return "Industrial";
    }
    return "Unknown";
  }

  private getCompetitionType(item: ISalesforceCostCategory) {
    if (item.Acc_CompetitionType__c === "Sector") {
      return "Sector";
    }
    return "Unknown";
  }
}
