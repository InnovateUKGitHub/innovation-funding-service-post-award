import { QueryBase } from "../common/queryBase";
import { IContext, PartnerDto, ProjectDto } from "@framework/types";
import { GetCostCategoriesQuery } from "./getCostCategoriesQuery";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export class GetCostCategoriesForPartnerQuery extends QueryBase<CostCategoryDto[]> {

  constructor(private readonly project: ProjectDto, private readonly partner: PartnerDto) {
    super();
  }

  protected async Run(context: IContext) {
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    return costCategories.filter(x => x.competitionType === this.project.competitionType && x.organisationType === this.partner.organisationType);
  }
}
