import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";

interface BaseClaimOverrideRate {
  amount: number;
  target: AwardRateOverrideTarget;
  targetId?: string;
}

interface PeriodClaimOverrideRate extends BaseClaimOverrideRate {
  period: PeriodId;
}

interface CostCategoryClaimOverrideRate extends BaseClaimOverrideRate {
  costCategoryId: CostCategoryId;
  costCategoryName: string;
}

interface PeriodClaimOverrideRates {
  overrides: PeriodClaimOverrideRate[];
  type: AwardRateOverrideType.BY_PERIOD;
}

interface CostCategoryClaimOverrideRates {
  overrides: CostCategoryClaimOverrideRate[];
  type: AwardRateOverrideType.BY_COST_CATEGORY;
}

interface NoClaimOverrideRates {
  overrides: never[];
  type: AwardRateOverrideType.NONE;
}

export type ClaimOverrideRateDto = PeriodClaimOverrideRates | CostCategoryClaimOverrideRates | NoClaimOverrideRates;

export type {
  BaseClaimOverrideRate,
  CostCategoryClaimOverrideRate,
  CostCategoryClaimOverrideRates,
  NoClaimOverrideRates,
  PeriodClaimOverrideRate,
  PeriodClaimOverrideRates,
};
