import { QueryBase } from "@server/features/common";
import { IContext } from "@framework/types";
import { CostCategoryType, PcrSpendProfileEntity } from "@framework/entities";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  PCRSpendProfileCostDto,
  PcrSpendProfileDto, PCRSpendProfileLabourCostDto, PCRSpendProfileStandardCostDto,
} from "@framework/dtos/pcrSpendProfileDto";

export class GetPcrSpendProfilesQuery extends QueryBase<PcrSpendProfileDto> {
  constructor(private readonly pcrItemId: string) {
    super();
  }

  protected async Run(context: IContext): Promise<PcrSpendProfileDto> {
    const spendProfiles = await context.repositories.pcrSpendProfile.getAllForPcr(this.pcrItemId);
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    return {
      costs: costCategories
        // For each cost category filter and map costs
        .map(x => this.mapCosts(x, spendProfiles.filter(s => s.costCategoryId === x.id)))
        // Flatten array
        .reduce((acc, x) => acc.concat(x), [])
    };
  }

  private mapCosts(costCategory: CostCategoryDto, spendProfiles: PcrSpendProfileEntity[]): PCRSpendProfileCostDto[] {
    // tslint:disable-next-line:no-small-switch
    switch (costCategory.type) {
      case CostCategoryType.Labour: return this.mapLabourCosts(spendProfiles, costCategory.type);
      default: return this.mapUnknownCosts(spendProfiles, CostCategoryType.Unknown);
    }
  }

  private mapUnknownCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Unknown): PCRSpendProfileStandardCostDto[] {
    return spendProfiles.map(x => ({
      costCategory,
      value: 0,
    }));
  }

  private mapLabourCosts(spendProfiles: PcrSpendProfileEntity[], costCategory: CostCategoryType.Labour): PCRSpendProfileLabourCostDto[] {
    return spendProfiles.map(x => ({
      costCategory,
      value: x.costOfRole,
    }));
  }
}
