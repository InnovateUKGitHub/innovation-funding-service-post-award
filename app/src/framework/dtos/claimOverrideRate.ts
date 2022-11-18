import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";

interface BaseClaimOverrideRate {
  amount: number;
  target: AwardRateOverrideTarget;
  targetId?: string;
}

interface PeriodClaimOverrideRate extends BaseClaimOverrideRate {
  period: number;
}

interface CostCategoryClaimOverrideRate extends BaseClaimOverrideRate {
  costCategoryId: string;
  costCategoryName: string;
}

interface PeriodClaimOverrideRates {
  type: AwardRateOverrideType.BY_PERIOD;
  overrides: PeriodClaimOverrideRate[];
}

interface CostCategoryClaimOverrideRates {
  type: AwardRateOverrideType.BY_COST_CATEGORY;
  overrides: CostCategoryClaimOverrideRate[];
}

interface NoClaimOverrideRates {
  type: AwardRateOverrideType.NONE;
  overrides: never[];
}

export type ClaimOverrideRateDto = PeriodClaimOverrideRates | CostCategoryClaimOverrideRates | NoClaimOverrideRates;

export type {
  BaseClaimOverrideRate,
  CostCategoryClaimOverrideRate,
  PeriodClaimOverrideRate,
  PeriodClaimOverrideRates,
  CostCategoryClaimOverrideRates,
  NoClaimOverrideRates,
};
