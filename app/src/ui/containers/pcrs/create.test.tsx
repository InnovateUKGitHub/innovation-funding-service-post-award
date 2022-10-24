import { renderHook } from "@testing-library/react";

import { hookTestBed } from "@shared/TestBed";
import { useCreatePcrContent } from "@ui/containers/pcrs/create";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("pcrs/Create", () => {
  describe("useCreatePcrContent()", () => {
    const stubContent = {
      pages: {
        pcrCreate: {
          selectTypesHint: "stub-selectTypesHint",
          backLink: "stub-backLink",
          selectRequestTypesTitle: "stub-selectRequestTypesTitle",
          buttonCreateRequest: "stub-createRequestButton",
          buttonCancelRequest: "stub-cancelRequestButton",
          guidanceIntroMessage: "stub-guidanceIntroMessage",
          guidanceList: {
            row1: "stub-guidanceListRow1",
            row2: "stub-guidanceListRow2",
          },
        },
      },
    };

    const setup = () => renderHook(useCreatePcrContent, hookTestBed({}));

    beforeAll(async () => {
      await testInitialiseInternationalisation(stubContent);
    });

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
