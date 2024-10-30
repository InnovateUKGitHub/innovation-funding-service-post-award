import { AwardRateOverrideTarget, AwardRateOverrideType } from "@framework/constants/awardRateOverride";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { getAwardRate } from "./awardRate";

describe("Award Rate helpers", () => {
  describe("getAwardRate()", () => {
    const partner = { awardRate: 10 };

    const noOverrides: ClaimOverrideRateDto = {
      overrides: [],
      type: AwardRateOverrideType.NONE,
    } as ClaimOverrideRateDto;

    const periodOverrides = {
      overrides: [
        {
          amount: 20,
          period: 2,
          target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
        },
        {
          amount: 30,
          period: 3,
          target: AwardRateOverrideTarget.THIS_PARTICIPANT,
        },
      ],
      type: AwardRateOverrideType.BY_PERIOD,
    } as ClaimOverrideRateDto;

    const costCategoryOverrides = {
      overrides: [
        {
          amount: 40,
          costCategoryId: "four",
          target: AwardRateOverrideTarget.ALL_PARTICIPANTS,
        },
        {
          amount: 50,
          costCategoryId: "five",
          target: AwardRateOverrideTarget.THIS_PARTICIPANT,
        },
      ],
      type: AwardRateOverrideType.BY_COST_CATEGORY,
    } as ClaimOverrideRateDto;

    test.each`
      name                                          | claimOverrides           | periodId | costCategoryId | expectedAwardRate
      ${"with no overrides"}                        | ${noOverrides}           | ${4}     | ${"something"} | ${partner.awardRate}
      ${"with out of scope period override"}        | ${periodOverrides}       | ${4}     | ${"something"} | ${partner.awardRate}
      ${"with in scope period override"}            | ${periodOverrides}       | ${3}     | ${"something"} | ${30}
      ${"with out of scope cost category override"} | ${costCategoryOverrides} | ${2}     | ${"six"}       | ${partner.awardRate}
      ${"with in scope cost category override"}     | ${costCategoryOverrides} | ${1}     | ${"five"}      | ${50}
    `("$name", ({ claimOverrides, periodId, costCategoryId, expectedAwardRate }) => {
      const result = getAwardRate({ partner, claimOverrides, periodId, costCategoryId });

      expect(result).toBe(expectedAwardRate);
    });
  });
});
