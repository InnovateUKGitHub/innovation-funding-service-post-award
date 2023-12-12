import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import {
  ClaimOverrideRateDto,
  CostCategoryClaimOverrideRate,
  CostCategoryClaimOverrideRates,
  NoClaimOverrideRates,
  PeriodClaimOverrideRates,
  PeriodClaimOverrideRate,
} from "@framework/dtos/claimOverrideRate";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetClaimOverrideRates extends QueryBase<ClaimOverrideRateDto> {
  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  protected async run(context: IContext) {
    const allTotalCostCategory = await context.repositories.profileTotalCostCategory.getAllByPartnerId(this.partnerId);
    const allTotalPeriod = await context.repositories.profileTotalPeriod.getAllByPartnerId(this.partnerId);

    const costCategoryOverrides: CostCategoryClaimOverrideRate[] = [];
    const periodOverrides: PeriodClaimOverrideRate[] = [];

    for (const totalCostCategory of allTotalCostCategory) {
      let foundOverride: CostCategoryClaimOverrideRate | undefined;

      if (typeof totalCostCategory.Acc_OverrideAwardRate__c === "number") {
        foundOverride = {
          amount: totalCostCategory.Acc_OverrideAwardRate__c,
          target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
          costCategoryId: totalCostCategory.Acc_CostCategory__c as CostCategoryId,
          costCategoryName: totalCostCategory.Acc_CostCategory__r.Acc_CostCategoryName__c,
        };
      }

      if (typeof totalCostCategory.Acc_ProfileOverrideAwardRate__c === "number") {
        foundOverride = {
          amount: totalCostCategory.Acc_ProfileOverrideAwardRate__c,
          target: AwardRateOverrideTarget.THIS_PARTICIPANT,
          targetId: this.partnerId,
          costCategoryId: totalCostCategory.Acc_CostCategory__c as CostCategoryId,
          costCategoryName: totalCostCategory.Acc_CostCategory__r.Acc_CostCategoryName__c,
        };
      }

      if (typeof totalCostCategory.Acc_CostCategoryAwardOverride__c === "number") {
        foundOverride = {
          amount: totalCostCategory.Acc_CostCategoryAwardOverride__c,
          target: AwardRateOverrideTarget.THIS_PARTICIPANT,
          costCategoryId: totalCostCategory.Acc_CostCategory__c as CostCategoryId,
          costCategoryName: totalCostCategory.Acc_CostCategory__r.Acc_CostCategoryName__c,
        };
      }

      if (foundOverride) {
        costCategoryOverrides.push(foundOverride);
      }
    }

    for (const totalPeriod of allTotalPeriod) {
      let foundOverride: PeriodClaimOverrideRate | undefined;

      if (typeof totalPeriod.Acc_OverrideAwardRate__c === "number") {
        foundOverride = {
          amount: totalPeriod.Acc_OverrideAwardRate__c,
          target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
          period: totalPeriod.Acc_ProjectPeriodNumber__c as PeriodId,
        };
      }

      if (typeof totalPeriod.Acc_ProfileOverrideAwardRate__c === "number") {
        foundOverride = {
          amount: totalPeriod.Acc_ProfileOverrideAwardRate__c,
          target: AwardRateOverrideTarget.THIS_PARTICIPANT,
          period: totalPeriod.Acc_ProjectPeriodNumber__c as PeriodId,
        };
      }

      if (foundOverride) {
        periodOverrides.push(foundOverride);
      }
    }

    // If there are both overrides on cost categories, as well as periods, error out.
    if (costCategoryOverrides.length > 0 && periodOverrides.length > 0) {
      const badPeriods = periodOverrides.map(override => override.period).join(", ");
      const badCostCategories = costCategoryOverrides.map(override => override.costCategoryName).join(", ");
      throw new Error(
        `A project cannot have both Cost Category and Period based award rate overrides - Check periods ${badPeriods} and cost categories ${badCostCategories}`,
      );
    }

    // If there are only costCategoryOverrides...
    if (costCategoryOverrides.length > 0) {
      return {
        type: AwardRateOverrideType.BY_COST_CATEGORY,
        overrides: costCategoryOverrides,
      } as CostCategoryClaimOverrideRates;
    }

    // If there are only periodOverrides...
    if (periodOverrides.length > 0) {
      return {
        type: AwardRateOverrideType.BY_PERIOD,
        overrides: periodOverrides,
      } as PeriodClaimOverrideRates;
    }

    // If there are no overrides for this project...
    return {
      type: AwardRateOverrideType.NONE,
      overrides: [] as never[],
    } as NoClaimOverrideRates;
  }
}
