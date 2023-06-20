import { createPCRSummaryDto } from "@framework/util/stubDtos";
import { PCRItemType, getUnavailablePcrItemsMatrix, PCRStatus } from "./pcrConstants";

describe("getUnavailablePcrItemsMatrix()", () => {
  const stubItemType = (type: PCRItemType) => ({ type, typeName: "stub-typeName", shortName: "stub-shortName" });

  describe("should never return a value", () => {
    test("with no pcrs", () => {
      const filteredValues = getUnavailablePcrItemsMatrix([]);

      expect(filteredValues).toStrictEqual([]);
    });

    test.each`
      name                | statusType
      ${"when Rejected"}  | ${PCRStatus.Rejected}
      ${"when Withdrawn"} | ${PCRStatus.Withdrawn}
      ${"when Approved"}  | ${PCRStatus.Approved}
      ${"when Actioned"}  | ${PCRStatus.Actioned}
    `("with an invalid type $name", ({ statusType }) => {
      const stubPcr = createPCRSummaryDto({ status: statusType });
      const filteredValues = getUnavailablePcrItemsMatrix([stubPcr]);

      expect(filteredValues).toStrictEqual([]);
    });
  });

  describe("with matrix cases", () => {
    describe("returns with matching values", () => {
      test("with reallocated project costs", () => {
        const stubDraftPcrPartnerVirement = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [stubItemType(PCRItemType.MultiplePartnerFinancialVirement)],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubDraftPcrPartnerVirement]);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement]);
      });

      test("with change project duration", () => {
        const stubDraftPcrTimeExtension = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [stubItemType(PCRItemType.TimeExtension)],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubDraftPcrTimeExtension]);

        expect(filteredValues).toStrictEqual([PCRItemType.TimeExtension]);
      });

      test("with project scope change", () => {
        const stubDraftPcrScopeChange = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [stubItemType(PCRItemType.ScopeChange)],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubDraftPcrScopeChange]);

        expect(filteredValues).toStrictEqual([PCRItemType.ScopeChange]);
      });
    });

    describe("returns with no matching values", () => {
      test.each`
        name                                     | itemTypeInput
        ${"with Unknown"}                        | ${PCRItemType.Unknown}
        ${"with AccountNameChange"}              | ${PCRItemType.AccountNameChange}
        ${"with PartnerAddition"}                | ${PCRItemType.PartnerAddition}
        ${"with PartnerWithdrawal"}              | ${PCRItemType.PartnerWithdrawal}
        ${"with ProjectSuspension"}              | ${PCRItemType.ProjectSuspension}
        ${"with SinglePartnerFinancialVirement"} | ${PCRItemType.SinglePartnerFinancialVirement}
        ${"with PeriodLengthChange"}             | ${PCRItemType.PeriodLengthChange}
      `("$name", ({ itemTypeInput }) => {
        const stubSinglePcr = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [stubItemType(itemTypeInput)],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubSinglePcr]);

        expect(filteredValues).toStrictEqual([]);
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

        const filteredValues = getUnavailablePcrItemsMatrix([stubInvalidPcrStatus]);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns two unique values", () => {
        const stubSinglePcrMultipleTypes = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [stubItemType(PCRItemType.MultiplePartnerFinancialVirement), stubItemType(PCRItemType.TimeExtension)],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubSinglePcrMultipleTypes]);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns two unique values with two ignored matrix items", () => {
        const stubSinglePcrMultipleTypesWithDupes = createPCRSummaryDto({
          status: PCRStatus.Draft,
          items: [
            stubItemType(PCRItemType.TimeExtension),
            stubItemType(PCRItemType.PartnerWithdrawal),
            stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
            stubItemType(PCRItemType.AccountNameChange),
          ],
        });

        const filteredValues = getUnavailablePcrItemsMatrix([stubSinglePcrMultipleTypesWithDupes]);

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
            status: PCRStatus.Actioned,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
        ];

        const filteredValues = getUnavailablePcrItemsMatrix(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns 1 value with 1 match ignored matrix statuses", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.Approved,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
          createPCRSummaryDto({
            status: PCRStatus.InExternalReview,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
        ];

        const filteredValues = getUnavailablePcrItemsMatrix(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns no values with valid status but no matrix conditions", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.QueriedByInnovateUK,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
          createPCRSummaryDto({
            status: PCRStatus.InExternalReview,
            items: [stubItemType(PCRItemType.Unknown), stubItemType(PCRItemType.PartnerAddition)],
          }),
        ];

        const filteredValues = getUnavailablePcrItemsMatrix(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([]);
      });

      test("returns two unique values for 1 valid pcr", () => {
        const stubMultiplePcrsMultipleTypes = [
          createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
          createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [stubItemType(PCRItemType.PartnerAddition), stubItemType(PCRItemType.PartnerWithdrawal)],
          }),
        ];

        const filteredValues = getUnavailablePcrItemsMatrix(stubMultiplePcrsMultipleTypes);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });

      test("returns two unique values with two duplicate types", () => {
        const stubMultiplePcrsDuplicateItems = [
          createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
          createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          }),
        ];

        const filteredValues = getUnavailablePcrItemsMatrix(stubMultiplePcrsDuplicateItems);

        expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement, PCRItemType.TimeExtension]);
      });
    });
  });
});
