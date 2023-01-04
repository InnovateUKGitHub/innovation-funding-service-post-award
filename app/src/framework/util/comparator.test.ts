import { DateTime } from "luxon";
import { dayComparator, nullableNumberComparator, projectPriorityComparator, stringComparator } from "@framework/util";

describe("stringComparator", () => {
  test("two strings passed in then return the response of the localeCompare method", () => {
    const a = "réservé";
    const b = "reserve";
    expect(stringComparator(a, b)).toEqual(1);
  });

  test("the second string is empty, return -1", () => {
    const a = "reserve";
    const b = "";
    expect(stringComparator(a, b)).toEqual(-1);
  });

  test("the first string is empty, return 1", () => {
    const a = "";
    const b = "reserve";
    expect(stringComparator(a, b)).toEqual(1);
  });

  test("both strings empty, return 0", () => {
    const a = "";
    const b = "";
    expect(stringComparator(a, b)).toEqual(0);
  });
});

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

describe("nullableNumberComparator", () => {
  test.each`
    a       | b       | ans
    ${1}    | ${2}    | ${-1}
    ${2}    | ${1}    | ${1}
    ${2}    | ${2}    | ${0}
    ${null} | ${2}    | ${-1}
    ${1}    | ${null} | ${1}
    ${null} | ${null} | ${0}
  `("comparing $a with $b", ({ a, b, ans }) => {
    const comparison = nullableNumberComparator(a, b);

    expect(comparison).toEqual(ans);
  });
});

describe("projectPriorityComparator", () => {
  describe("@returns", () => {
    const noClaimsAndReviewsOrQueries = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const noClaimsAndReviewsOrQueriesAgain = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const claimsNoReviewSingle = {
      Acc_ClaimsForReview__c: { value: 1 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const claimsNoReviewMany = {
      Acc_ClaimsForReview__c: { value: 4 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const reviewNoClaimsSingle = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 1 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const reviewNoClaimsMany = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 4 },
      Acc_PCRsUnderQuery__c: { value: 0 },
    } as const;
    const queriesNoClaimsSingle = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 1 },
    } as const;
    const queriesNoClaimsMany = {
      Acc_ClaimsForReview__c: { value: 0 },
      Acc_PCRsForReview__c: { value: 0 },
      Acc_PCRsUnderQuery__c: { value: 4 },
    } as const;
    const claimWithReview = {
      Acc_ClaimsForReview__c: { value: 1 },
      Acc_PCRsForReview__c: { value: 1 },
      Acc_PCRsUnderQuery__c: { value: 1 },
    } as const;
    const claimsWithReviews = {
      Acc_ClaimsForReview__c: { value: 2 },
      Acc_PCRsForReview__c: { value: 2 },
      Acc_PCRsUnderQuery__c: { value: 2 },
    } as const;

    describe("@returns singular comparisons", () => {
      test.each`
        name                                                          | aProject                 | bProject
        ${"when no claims or review should always sit below claim"}   | ${claimsNoReviewSingle}  | ${noClaimsAndReviewsOrQueries}
        ${"when no claims or review should always sit below review"}  | ${reviewNoClaimsSingle}  | ${noClaimsAndReviewsOrQueries}
        ${"when no claims or review should always sit below queries"} | ${queriesNoClaimsSingle} | ${noClaimsAndReviewsOrQueries}
        ${"when claim should sort higher than reviews"}               | ${claimsNoReviewSingle}  | ${reviewNoClaimsSingle}
        ${"when claim should sort higher than queries"}               | ${claimsNoReviewSingle}  | ${queriesNoClaimsSingle}
        ${"when many claims should sort higher than reviews"}         | ${claimsNoReviewMany}    | ${reviewNoClaimsMany}
        ${"when many claims should sort higher than queries"}         | ${claimsNoReviewMany}    | ${queriesNoClaimsMany}
        ${"when no claims should sort below than many reviews"}       | ${reviewNoClaimsMany}    | ${noClaimsAndReviewsOrQueries}
        ${"when no claims should sort below than many queries"}       | ${queriesNoClaimsMany}   | ${noClaimsAndReviewsOrQueries}
      `("$name", ({ aProject, bProject }) => {
        const comparison = projectPriorityComparator(aProject, bProject);
        expect(comparison).toBeLessThanOrEqual(-1);
      });

      test.each`
        name                                           | aProject                       | bProject
        ${"when two projects have the same 0 entries"} | ${noClaimsAndReviewsOrQueries} | ${noClaimsAndReviewsOrQueriesAgain}
        ${"when the same project is passed in"}        | ${claimsWithReviews}           | ${claimsWithReviews}
      `("$name", ({ aProject, bProject }) => {
        const comparison = projectPriorityComparator(aProject, bProject);
        expect(comparison).toBe(0);
      });

      test.each`
        name                                                      | aProject                       | bProject
        ${"when neither claim or review single match"}            | ${noClaimsAndReviewsOrQueries} | ${claimWithReview}
        ${"when neither claim or review multiples match"}         | ${noClaimsAndReviewsOrQueries} | ${claimsWithReviews}
        ${"when review should sort below than claim"}             | ${reviewNoClaimsSingle}        | ${claimsNoReviewSingle}
        ${"when many reviews should sort below than many claims"} | ${reviewNoClaimsMany}          | ${claimsNoReviewMany}
      `("$name", ({ aProject, bProject }) => {
        const comparison = projectPriorityComparator(aProject, bProject);
        expect(comparison).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
