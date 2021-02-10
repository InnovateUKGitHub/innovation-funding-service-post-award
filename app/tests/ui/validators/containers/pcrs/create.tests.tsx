import { renderHook } from "@testing-library/react-hooks";

import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { useCreatePcrContent } from "@ui/containers";

const stubContent = {
  pcrCreate: {
    learnMoreAboutTitle: {
      content: "stub-learnMoreAboutTitle",
    },
    reallocateCostsTitle: {
      content: "stub-reallocateCostsTitle",
    },
    reallocateCostsMessage: {
      content: "stub-reallocateCostsMessage",
    },
    removePartnerTitle: {
      content: "stub-removePartnerTitle",
    },
    removePartnerMessage: {
      content: "stub-removePartnerMessage",
    },
    addPartnerTitle: {
      content: "stub-addPartnerTitle",
    },
    addPartnerMessage: {
      content: "stub-addPartnerMessage",
    },
    changeScopeTitle: {
      content: "stub-changeScopeTitle",
    },
    changeScopeMessage: {
      content: "stub-changeScopeMessage",
    },
    changeDurationTitle: {
      content: "stub-changeDurationTitle",
    },
    changeDurationMessage: {
      content: "stub-changeDurationMessage",
    },
    changePartnersNameTitle: {
      content: "stub-changePartnersNameTitle",
    },
    changePartnersNameMessage: {
      content: "stub-changePartnersNameMessage",
    },
    putProjectOnHoldTitle: {
      content: "stub-putProjectOnHoldTitle",
    },
    putProjectOnHoldMessage: {
      content: "stub-putProjectOnHoldMessage",
    },
    endProjectEarlyTitle: {
      content: "stub-endProjectEarlyTitle",
    },
    endProjectEarlyMessage: {
      content: "stub-endProjectEarlyMessage",
    },
    selectTypesHint: {
      content: "stub-selectTypesHint",
    },
    backLink: {
      content: "stub-backLink",
    },
    selectRequestTypesTitle: {
      content: "stub-selectRequestTypesTitle",
    },
    createRequestButton: {
      content: "stub-createRequestButton",
    },
    cancelRequestButton: {
      content: "stub-cancelRequestButton",
    },
    guidanceIntroMessage: {
      content: "stub-guidanceIntroMessage",
    },
    guidanceListRow1: {
      content: "stub-guidanceListRow1",
    },
    guidanceListRow2: {
      content: "stub-guidanceListRow2",
    },
  },
} as any;

describe("useCreatePcrContent()", () => {
  test.each`
    name                           | property
    ${"learnMoreAboutTitle"}       | ${"learnMoreAboutTitle"}
    ${"reallocateCostsTitle"}      | ${"reallocateCostsTitle"}
    ${"reallocateCostsMessage"}    | ${"reallocateCostsMessage"}
    ${"removePartnerTitle"}        | ${"removePartnerTitle"}
    ${"removePartnerMessage"}      | ${"removePartnerMessage"}
    ${"addPartnerTitle"}           | ${"addPartnerTitle"}
    ${"addPartnerMessage"}         | ${"addPartnerMessage"}
    ${"changeScopeTitle"}          | ${"changeScopeTitle"}
    ${"changeScopeMessage"}        | ${"changeScopeMessage"}
    ${"changeDurationMessage"}     | ${"changeDurationMessage"}
    ${"changeDurationTitle"}       | ${"changeDurationTitle"}
    ${"changePartnersNameTitle"}   | ${"changePartnersNameTitle"}
    ${"changePartnersNameMessage"} | ${"changePartnersNameMessage"}
    ${"putProjectOnHoldTitle"}     | ${"putProjectOnHoldTitle"}
    ${"putProjectOnHoldMessage"}   | ${"putProjectOnHoldMessage"}
    ${"endProjectEarlyTitle"}      | ${"endProjectEarlyTitle"}
    ${"endProjectEarlyMessage"}    | ${"endProjectEarlyMessage"}
    ${"selectTypesHint"}           | ${"selectTypesHint"}
    ${"backLink"}                  | ${"backLink"}
    ${"selectRequestTypesTitle"}   | ${"selectRequestTypesTitle"}
    ${"createRequestButton"}       | ${"createRequestButton"}
    ${"cancelRequestButton"}       | ${"cancelRequestButton"}
    ${"guidanceIntroMessage"}      | ${"guidanceIntroMessage"}
    ${"guidanceListRow1"}          | ${"guidanceListRow1"}
    ${"guidanceListRow2"}          | ${"guidanceListRow2"}
  `("with $property ", ({ name, property }) => {
    const { result } = renderHook(useCreatePcrContent, hookTestBed({ content: stubContent as TestBedContent }));

    const content = (result.current as any)[name];
    const expectedContent = stubContent.pcrCreate[property].content;

    expect(content).toBe(expectedContent);
  });
});
