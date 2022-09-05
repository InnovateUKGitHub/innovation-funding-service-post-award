import { renderHook } from "@testing-library/react";

import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { useCreatePcrContent } from "@ui/containers/pcrs/create";

describe("pcrs/Create", () => {
  describe("useCreatePcrContent()", () => {
    const stubContent = {
      pcrCreate: {
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
      test("with expected content", () => {
        const { current } = setup().result;

        expect(current).toMatchInlineSnapshot(`
          Object {
            "backLink": "stub-backLink",
            "cancelRequestButton": "stub-cancelRequestButton",
            "createRequestButton": "stub-createRequestButton",
            "guidanceIntroMessage": "stub-guidanceIntroMessage",
            "guidanceListRow1": "stub-guidanceListRow1",
            "guidanceListRow2": "stub-guidanceListRow2",
            "selectRequestTypesTitle": "stub-selectRequestTypesTitle",
            "selectTypesHint": "stub-selectTypesHint",
          }
        `);
      });
    });
  });
});
