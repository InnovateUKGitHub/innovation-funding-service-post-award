import { createPCRSummaryDto } from "@framework/util/stubDtos";
import { PCRItemType, getPcrItemsSingleInstanceInAnyPcrViolations, PCRStatus } from "./pcrConstants";

describe("getPcrItemsSingleInstanceInAnyPcrViolations()", () => {
  const stubItemType = (type: PCRItemType) => ({ type, typeName: "stub-typeName", shortName: "stub-shortName" });

  describe("should never return a value", () => {
    test("with no pcrs", () => {
      const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([]);

      expect(filteredValues).toStrictEqual([]);
    });

    test.each`
      name                | statusType
      ${"when Rejected"}  | ${PCRStatus.Rejected}
      ${"when Withdrawn"} | ${PCRStatus.Withdrawn}
      ${"when Approved"}  | ${PCRStatus.Approved}
      ${"when Actioned"}  | ${PCRStatus.DeprecatedActioned}
    `("with an invalid type $name", ({ statusType }) => {
      const stubPcr = createPCRSummaryDto({ status: statusType });
      const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([stubPcr]);

      expect(filteredValues).toStrictEqual([]);
    });
  });

  describe("with matrix cases", () => {
    describe("returns with no matching values", () => {
      test.each`
        name                                       | itemTypeInput                                   | matchingValues
        ${"with Unknown"}                          | ${PCRItemType.Unknown}                          | ${[]}
        ${"with AccountNameChange"}                | ${PCRItemType.AccountNameChange}                | ${[]}
        ${"with PartnerAddition"}                  | ${PCRItemType.PartnerAddition}                  | ${[]}
        ${"with PartnerWithdrawal"}                | ${PCRItemType.PartnerWithdrawal}                | ${[]}
        ${"with PeriodLengthChange"}               | ${PCRItemType.PeriodLengthChange}               | ${[]}
        ${"with ProjectSuspension"}                | ${PCRItemType.ProjectSuspension}                | ${[PCRItemType.ProjectSuspension]}
        ${"with MultiplePartnerFinancialVirement"} | ${PCRItemType.MultiplePartnerFinancialVirement} | ${[PCRItemType.MultiplePartnerFinancialVirement]}
        ${"with TimeExtension"}                    | ${PCRItemType.TimeExtension}                    | ${[PCRItemType.TimeExtension]}
        ${"with ScopeChange"}                      | ${PCRItemType.ScopeChange}                      | ${[PCRItemType.ScopeChange]}
      `("$name", ({ itemTypeInput, matchingValues }) => {
        const stubSinglePcr = createPCRSummaryDto({
          status: PCRStatus.DraftWithProjectManager,
          items: [stubItemType(itemTypeInput)],
        });

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([stubSinglePcr]);

        expect(filteredValues).toStrictEqual(matchingValues);
      });
    });
  });

  describe("with mixed combinations", () => {
    describe("single pcr", () => {
      test("returns no value due to ignored matrix statuses", () => {
        const stubInvalidPcrStatus = createPCRSummaryDto({
          status: PCRStatus.Approved,
          items: [stubItemType(PCRItemType.MultiplePartnerFinancialVirement), stubItemType(PCRItemType.TimeExtension)],
        });

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([stubInvalidPcrStatus]);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns two unique values", () => {
        const stubSinglePcrMultipleTypes = createPCRSummaryDto({
          status: PCRStatus.DraftWithProjectManager,
          items: [stubItemType(PCRItemType.MultiplePartnerFinancialVirement), stubItemType(PCRItemType.TimeExtension)],
        });

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([stubSinglePcrMultipleTypes]);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns two unique values with two ignored matrix items", () => {
        const stubSinglePcrMultipleTypesWithDupes = createPCRSummaryDto({
          status: PCRStatus.DraftWithProjectManager,
          items: [
            stubItemType(PCRItemType.TimeExtension),
            stubItemType(PCRItemType.PartnerWithdrawal),
            stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
            stubItemType(PCRItemType.AccountNameChange),
          ],
        });

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations([stubSinglePcrMultipleTypesWithDupes]);

        expect(filteredValues).toStrictEqual([PCRItemType.TimeExtension, PCRItemType.MultiplePartnerFinancialVirement]);
      });
    });

    describe("multiple pcrs", () => {
      test("returns no values as both match ignored matrix statuses", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.Approved,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
          createPCRSummaryDto({
            status: PCRStatus.DeprecatedActioned,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
        ];

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns 1 value with 1 match ignored matrix statuses", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.Approved,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
          createPCRSummaryDto({
            status: PCRStatus.DeprecatedInExternalReview,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
        ];

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns no values with valid status but no matrix conditions", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.QueriedToProjectManager,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
          createPCRSummaryDto({
            status: PCRStatus.DeprecatedInExternalReview,
            items: [stubItemType(PCRItemType.Unknown), stubItemType(PCRItemType.PartnerAddition)],
          }),
        ];

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns two unique values for 1 valid pcr", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.DraftWithProjectManager,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
          createPCRSummaryDto({
            status: PCRStatus.DraftWithProjectManager,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
        ];

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns two unique values with two duplicate types", () => {
        const stubMultiplePcrsDuplicateItems = [
          createPCRSummaryDto({
            status: PCRStatus.DraftWithProjectManager,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
          createPCRSummaryDto({
            status: PCRStatus.DraftWithProjectManager,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
        ];

        const filteredValues = getPcrItemsSingleInstanceInAnyPcrViolations(stubMultiplePcrsDuplicateItems);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });
    });
  });
});
