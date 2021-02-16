// tslint:disable: no-big-function no-duplicate-string
import { renderHook } from "@testing-library/react-hooks";
import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { Content } from "@content/content";
import { PCRItemType, PCRStatus } from "@framework/types";
import { createPCRSummaryDto } from "@framework/util/stubDtos";
import { filterPcrsByItemType, useCreatePcrContent } from "@ui/containers/pcrs/create";

describe("pcrs/Create", () => {
  describe("useCreatePcrContent()", () => {
    const stubContent = {
      pcrCreate: {
        learnMoreAboutTitle: { content: "stub-learnMoreAboutTitle" },
        reallocateCostsTitle: { content: "stub-reallocateCostsTitle" },
        reallocateCostsMessage: { content: "stub-reallocateCostsMessage" },
        removePartnerTitle: { content: "stub-removePartnerTitle" },
        removePartnerMessage: { content: "stub-removePartnerMessage" },
        addPartnerTitle: { content: "stub-addPartnerTitle" },
        addPartnerMessage: { content: "stub-addPartnerMessage" },
        changeScopeTitle: { content: "stub-changeScopeTitle" },
        changeScopeMessage: { content: "stub-changeScopeMessage" },
        changeDurationTitle: { content: "stub-changeDurationTitle" },
        changeDurationMessage: { content: "stub-changeDurationMessage" },
        changePartnersNameTitle: { content: "stub-changePartnersNameTitle" },
        changePartnersNameMessage: { content: "stub-changePartnersNameMessage" },
        putProjectOnHoldTitle: { content: "stub-putProjectOnHoldTitle" },
        putProjectOnHoldMessage: { content: "stub-putProjectOnHoldMessage" },
        endProjectEarlyTitle: { content: "stub-endProjectEarlyTitle" },
        endProjectEarlyMessage: { content: "stub-endProjectEarlyMessage" },
        selectTypesHint: { content: "stub-selectTypesHint" },
        backLink: { content: "stub-backLink" },
        selectRequestTypesTitle: { content: "stub-selectRequestTypesTitle" },
        createRequestButton: { content: "stub-createRequestButton" },
        cancelRequestButton: { content: "stub-cancelRequestButton" },
        guidanceIntroMessage: { content: "stub-guidanceIntroMessage" },
        guidanceListRow1: { content: "stub-guidanceListRow1" },
        guidanceListRow2: { content: "stub-guidanceListRow2" },
      },
    };

    const setup = () => renderHook(useCreatePcrContent, hookTestBed({ content: stubContent as TestBedContent }));

    describe("@returns", () => {
      type PcrContentKeys = Exclude<keyof Content["pcrCreate"], "title">;

      const pcrContentKeys = Object.keys(stubContent.pcrCreate) as PcrContentKeys[];

      test.each(pcrContentKeys)("with %s", contentKey => {
        const current = setup().result.current;

        const contentTarget = current[contentKey];
        const expectedValue = stubContent.pcrCreate[contentKey].content;

        expect(contentTarget).toBe(expectedValue);
      });
    });
  });

  describe("filterPcrsByItemType()", () => {
    const stubItemType = (type: PCRItemType) => ({ type, typeName: "stub-typeName", shortName: "stub-shortName" });

    describe("should never return a value", () => {
      test("with no pcrs", () => {
        const filteredValues = filterPcrsByItemType([]);

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
        const filteredValues = filterPcrsByItemType([stubPcr]);

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

          const filteredValues = filterPcrsByItemType([stubDraftPcrPartnerVirement]);

          expect(filteredValues).toStrictEqual([PCRItemType.MultiplePartnerFinancialVirement]);
        });

        test("with change project duration", () => {
          const stubDraftPcrTimeExtension = createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [stubItemType(PCRItemType.TimeExtension)],
          });

          const filteredValues = filterPcrsByItemType([stubDraftPcrTimeExtension]);

          expect(filteredValues).toStrictEqual([PCRItemType.TimeExtension]);
        });

        test("with project scope change", () => {
          const stubDraftPcrScopeChange = createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [stubItemType(PCRItemType.ScopeChange)],
          });

          const filteredValues = filterPcrsByItemType([stubDraftPcrScopeChange]);

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
          ${"with ProjectTermination"}             | ${PCRItemType.ProjectTermination}
          ${"with SinglePartnerFinancialVirement"} | ${PCRItemType.SinglePartnerFinancialVirement}
          ${"with PeriodLengthChange"}             | ${PCRItemType.PeriodLengthChange}
        `("$name", ({ itemTypeInput }) => {
          const stubSinglePcr = createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [stubItemType(itemTypeInput)],
          });

          const filteredValues = filterPcrsByItemType([stubSinglePcr]);

          expect(filteredValues).toStrictEqual([]);
        });
      });
    });

    describe("with mixed combinations", () => {
      describe("single pcr", () => {
        test("returns no value due to ignored matrix statuses", () => {
          const stubInvalidPcrStatus = createPCRSummaryDto({
            status: PCRStatus.Approved,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          });

          const filteredValues = filterPcrsByItemType([stubInvalidPcrStatus]);

          expect(filteredValues).toStrictEqual([]);
        });

        test("returns two unique values", () => {
          const stubSinglePcrMultipleTypes = createPCRSummaryDto({
            status: PCRStatus.Draft,
            items: [
              stubItemType(PCRItemType.MultiplePartnerFinancialVirement),
              stubItemType(PCRItemType.TimeExtension),
            ],
          });

          const filteredValues = filterPcrsByItemType([stubSinglePcrMultipleTypes]);

          expect(filteredValues).toStrictEqual([
            PCRItemType.MultiplePartnerFinancialVirement,
            PCRItemType.TimeExtension,
          ]);
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

          const filteredValues = filterPcrsByItemType([stubSinglePcrMultipleTypesWithDupes]);

          expect(filteredValues).toStrictEqual([
            PCRItemType.TimeExtension,
            PCRItemType.MultiplePartnerFinancialVirement,
          ]);
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

          const filteredValues = filterPcrsByItemType(stubMultiplePcrsMultipleTypes);

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

          const filteredValues = filterPcrsByItemType(stubMultiplePcrsMultipleTypes);

          expect(filteredValues).toStrictEqual([
            PCRItemType.MultiplePartnerFinancialVirement,
            PCRItemType.TimeExtension,
          ]);
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

          const filteredValues = filterPcrsByItemType(stubMultiplePcrsMultipleTypes);

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

          const filteredValues = filterPcrsByItemType(stubMultiplePcrsMultipleTypes);

          expect(filteredValues).toStrictEqual([
            PCRItemType.MultiplePartnerFinancialVirement,
            PCRItemType.TimeExtension,
          ]);
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

          const filteredValues = filterPcrsByItemType(stubMultiplePcrsDuplicateItems);

          expect(filteredValues).toStrictEqual([
            PCRItemType.MultiplePartnerFinancialVirement,
            PCRItemType.TimeExtension,
          ]);
        });
      });
    });
  });
});
