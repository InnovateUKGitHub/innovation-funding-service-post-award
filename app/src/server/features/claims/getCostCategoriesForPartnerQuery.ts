import { IContext, PartnerDto } from "@framework/types";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { QueryBase } from "../common/queryBase";
import { GetFilteredCostCategoriesQuery } from "./getCostCategoriesQuery";

export class GetCostCategoriesForPartnerQuery extends QueryBase<CostCategoryDto[]> {
  constructor(private readonly partner: PartnerDto) {
    super();
  }

  protected async run(context: IContext) {
    const costCategories = await context.runQuery(new GetFilteredCostCategoriesQuery(this.partner.id));

    // TODO: Remove (competitionType , organisationType) duplicate logic and refactor into GetFilteredCostCategoriesQuery()
    return costCategories.filter(
      x => x.competitionType === this.partner.competitionType && x.organisationType === this.partner.organisationType,
    );
  }
}
