import { DateTime } from "luxon";
import { dayComparator, projectPriorityComparator } from "@framework/util";
import { createProjectDto } from "@framework/util/stubDtos";

describe("dayComparator", () => {
  const dateFormat = "dd/MM/yyyy HH:mm";

  describe("@returns", () => {
    test("with days are the same", () => {
      const dateA = DateTime.fromFormat("01/01/2010 01:11", dateFormat).toJSDate();
      const dateB = DateTime.fromFormat("01/01/2010 02:12", dateFormat).toJSDate();
      expect(dayComparator(dateA, dateB)).toBe(0);
    });

    test("with greater than zero when day A is after day B", () => {
      const dateA = DateTime.fromFormat("01/01/2012 01:11", dateFormat).toJSDate();
      const dateB = DateTime.fromFormat("01/01/2010 02:12", dateFormat).toJSDate();
      expect(dayComparator(dateA, dateB)).toBeGreaterThan(0);
    });

    test("with less than zero when day A is before day B", () => {
      const dateA = DateTime.fromFormat("01/01/2010 01:11", dateFormat).toJSDate();
      const dateB = DateTime.fromFormat("02/01/2010 02:12", dateFormat).toJSDate();
      expect(dayComparator(dateA, dateB)).toBeLessThan(0);
    });
  });
});

describe("projectPriorityComparator", () => {
  describe("@returns", () => {
    const noClaimsAndReviews = createProjectDto({ claimsToReview: 0, pcrsToReview: 0 });

    const claimsNoReviewSingle = createProjectDto({ claimsToReview: 1, pcrsToReview: 0 });
    const claimsNoReviewMany = createProjectDto({ claimsToReview: 4, pcrsToReview: 0 });

    const reviewNoClaimsSingle = createProjectDto({ claimsToReview: 0, pcrsToReview: 1 });
    const reviewNoClaimsMany = createProjectDto({ claimsToReview: 0, pcrsToReview: 4 });

    const claimWithReview = createProjectDto({ claimsToReview: 1, pcrsToReview: 1 });
    const claimsWithReviews = createProjectDto({ claimsToReview: 2, pcrsToReview: 2 });

    describe("@returns singular comparisons", () => {
      test.each`
        name                                                         | aProject                | bProject
        ${"when no claims or review should always sit below claim"}  | ${claimsNoReviewSingle} | ${noClaimsAndReviews}
        ${"when no claims or review should always sit below review"} | ${reviewNoClaimsSingle} | ${noClaimsAndReviews}
        ${"when claim should sort higher than reviews"}              | ${claimsNoReviewSingle} | ${reviewNoClaimsSingle}
        ${"when many claims should sort higher than reviews"}        | ${claimsNoReviewMany}   | ${reviewNoClaimsMany}
        ${"when no claims should sort below than many reviews"}      | ${reviewNoClaimsMany}   | ${noClaimsAndReviews}
      `("will return before $name", ({ aProject, bProject }) => {
        const comparison = projectPriorityComparator(aProject, bProject);

        expect(comparison).toBeLessThanOrEqual(-1);
      });

      test.each`
        name                                                      | aProject                | bProject
        ${"when neither claim or review single match"}            | ${noClaimsAndReviews}   | ${claimWithReview}
        ${"when neither claim or review multiples match"}         | ${noClaimsAndReviews}   | ${claimsWithReviews}
        ${"when review should sort below than claim"}             | ${reviewNoClaimsSingle} | ${claimsNoReviewSingle}
        ${"when many reviews should sort below than many claims"} | ${reviewNoClaimsMany}   | ${claimsNoReviewMany}
      `("will return before $name", ({ aProject, bProject }) => {
        const comparison = projectPriorityComparator(aProject, bProject);

        expect(comparison).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
