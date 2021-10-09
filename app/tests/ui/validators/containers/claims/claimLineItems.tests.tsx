import { renderHook } from "@testing-library/react-hooks";
import { useClaimLineItemsContent } from "@ui/containers";
import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { Content } from "@content/content";

describe("claimLineItems", () => {
  describe("useClaimLineItemsContent()", () => {
    const stubContent = {
      claimLineItems: {
        supportingDocumentsTitle: { content: "stub-supportingDocumentsTitle" },
        additionalInfoTitle: { content: "stub-additionalInfoTitle" },
        totalCostTitle: { content: "stub-totalCostTitle" },
        forecastCostTitle: { content: "stub-forecastCostTitle" },
        differenceTitle: { content: "stub-differenceTitle" },
        descriptionHeader: { content: "stub-descriptionHeader" },
        costHeader: { content: "stub-costHeader" },
        lastUpdatedHeader: { content: "stub-lastUpdatedHeader" },
        noDataMessage: { content: "stub-noDataMessage" },
      },
    };

    const setup = () => renderHook(useClaimLineItemsContent, hookTestBed({ content: stubContent as TestBedContent }));

    describe("@returns", () => {
      type ClaimLineItemsKeys = Exclude<keyof Content["claimLineItems"], "title">[];

      const contentKeys = Object.keys(stubContent.claimLineItems) as ClaimLineItemsKeys;

      test.each(contentKeys)("with %s", contentKey => {
        const { current } = setup().result;

        const contentTarget = current[contentKey];
        const expectedValue = stubContent.claimLineItems[contentKey].content;

        expect(contentTarget).toBe(expectedValue);
      });
    });
  });
});
