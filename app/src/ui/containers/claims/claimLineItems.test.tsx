import { renderHook } from "@testing-library/react";
import { useClaimLineItemsContent } from "@ui/containers";
import { hookTestBed } from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("claimLineItems", () => {
  describe("useClaimLineItemsContent()", () => {
    const stubContent = {
      pages: {
        claimLineItems: {
          supportingDocumentsTitle: "stub-supportingDocumentsTitle",
          additionalInfoTitle: "stub-additionalInfoTitle",
          totalCostTitle: "stub-totalCostTitle",
          forecastCostTitle: "stub-forecastCostTitle",
          differenceTitle: "stub-differenceTitle",
          descriptionHeader: "stub-descriptionHeader",
          costHeader: "stub-costHeader",
          lastUpdatedHeader: "stub-lastUpdatedHeader",
          noDataMessage: "stub-noDataMessage",
        },
      },
    };

    const setup = () => renderHook(useClaimLineItemsContent, hookTestBed({}));

    beforeAll(async () => {
      await testInitialiseInternationalisation(stubContent);
    });

    describe("@returns", () => {
      const contentKeys = Object.keys(stubContent.pages.claimLineItems);
      type ContentKeyType = keyof typeof stubContent.pages.claimLineItems;

      test.each(contentKeys)("with %s", contentKey => {
        const { current } = setup().result;

        const contentTarget = current[contentKey as ContentKeyType];
        const expectedValue = stubContent.pages.claimLineItems[contentKey as ContentKeyType];

        expect(contentTarget).toBe(expectedValue);
      });
    });
  });
});
