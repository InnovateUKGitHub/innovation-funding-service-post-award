import { roundCurrency, sum } from "@framework/util";

export const calculateNewEligibleCosts = (virements: CostCategoryVirementDto[]) => {
  return roundCurrency(sum(virements, v => v.newEligibleCosts));
};

export const calculateNewRemainingGrant = (virements: CostCategoryVirementDto[], newFundingLevel: number) => {
  const newEligibleCosts = calculateNewEligibleCosts(virements);
  const costsClaimedToDate = sum(virements, v => v.costsClaimedToDate);
  const newRemainingCosts = newEligibleCosts - costsClaimedToDate;
  return roundCurrency(newRemainingCosts * newFundingLevel / 100);
};
