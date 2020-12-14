import {
  CostCategoryVirementDtoValidator,
  FinancialVirementDtoValidator,
  PartnerVirementsDtoValidator,
} from "@ui/validators/financialVirementDtoValidator";
import {
  CostCategoryVirementDto,
  FinancialVirementDto,
  PartnerVirementsDto,
} from "@framework/dtos/finacialVirementDto";

describe("financialVirementDtoValidator", () => {
  describe("@validates", () => {
    describe("partner eligible costs", () => {
      test.each`
        name                                              | newEligibleCosts | isValid
        ${"given null"}                                   | ${null}          | ${false}
        ${"given value lower than costs claimed to date"} | ${2_100}         | ${true}
        ${"given negative value"}                         | ${-15}           | ${false}
      `("$name", ({ newEligibleCosts, isValid }) => {
        const stubCostCategoryVirement = {
          costsClaimedToDate: 2_000,
          newEligibleCosts,
        } as CostCategoryVirementDto;

        const validation = new CostCategoryVirementDtoValidator(stubCostCategoryVirement, false);
        expect(validation.newPartnerEligibleCosts.isValid).toBe(isValid);
      });
    });

    describe("partner remaining grant", () => {
      test.each`
        name                                       | newRemainingGrant | isValid
        ${"given null"}                            | ${null}           | ${false}
        ${"given value lower than original grant"} | ${2_100}          | ${true}
        ${"given negative value"}                  | ${-15}            | ${false}
      `("$name", ({ newRemainingGrant, isValid }) => {
        const stubPartnerVirements = {
          originalRemainingGrant: 2_500,
          newRemainingGrant,
        } as PartnerVirementsDto;

        const validation = new PartnerVirementsDtoValidator(stubPartnerVirements, false);
        expect(validation.newRemainingGrant.isValid).toBe(isValid);
      });
    });

    describe("total remaining grant", () => {
      test.each`
        name                                                       | newRemainingGrant | isValid  | submit
        ${"given null, no submit"}                                 | ${null}           | ${false} | ${true}
        ${"given new grant lower than remaining grant, to submit"} | ${4_000}          | ${true}  | ${true}
        ${"given new grant lower than remaining grant, no submit"} | ${1}              | ${true}  | ${false}
      `("$name", ({ newRemainingGrant, isValid }) => {
        const stubFinancialVirement = {
          originalRemainingGrant: 5_000,
          newRemainingGrant,
        } as FinancialVirementDto;

        const validation = new FinancialVirementDtoValidator(stubFinancialVirement, false, true);
        expect(validation.newRemainingGrant.isValid).toBe(isValid);
      });
    });
  });
});
