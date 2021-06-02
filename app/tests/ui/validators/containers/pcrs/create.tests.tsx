// tslint:disable: no-big-function no-duplicate-string
import { renderHook } from "@testing-library/react-hooks";
import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { Content } from "@content/content";
import { useCreatePcrContent } from "@ui/containers/pcrs/create";

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
});
