import { AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { PartnerDto } from "@framework/dtos/partnerDto";

interface GetAwardRateProps {
  partner: Pick<PartnerDto, "awardRate">;
  claimOverrides: ClaimOverrideRateDto;
  periodId: PeriodId;
  costCategoryId: CostCategoryId;
}

const getAwardRate = ({ partner, claimOverrides, periodId, costCategoryId }: GetAwardRateProps) => {
  const baseAwardRate = partner.awardRate ?? 0;

  if (claimOverrides.type === AwardRateOverrideType.BY_COST_CATEGORY) {
    const override = claimOverrides.overrides.find(x => x.costCategoryId === costCategoryId);
    if (override) return override.amount;
    return baseAwardRate;
  }

  if (claimOverrides.type === AwardRateOverrideType.BY_PERIOD) {
    const override = claimOverrides.overrides.find(x => x.period === periodId);
    if (override) return override.amount;
    return baseAwardRate;
  }

  return baseAwardRate;
};

export { getAwardRate };
