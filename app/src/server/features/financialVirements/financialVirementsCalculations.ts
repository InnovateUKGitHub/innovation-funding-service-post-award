import { roundCurrency, sumBy } from "@framework/util";
import { CostCategoryVirementDto } from "@framework/dtos";

export const calculateNewEligibleCosts = (virements: CostCategoryVirementDto[]) => {
  return roundCurrency(sumBy(virements, v => v.newEligibleCosts));
};

export const calculateNewRemainingGrant = (virements: CostCategoryVirementDto[], newFundingLevel: number) => {
  const newEligibleCosts = calculateNewEligibleCosts(virements);
  const costsClaimedToDate = sumBy(virements, v => v.costsClaimedToDate);
  const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
  return roundCurrency((newRemainingCosts * newFundingLevel) / 100);
};
