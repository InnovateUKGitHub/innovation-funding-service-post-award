import React from "react";
import { render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import * as hook from "@ui/containers/claims/components/allowed-documents.hook";
import { EnumDocuments } from "@ui/containers/claims/components/EnumDocuments";

const stubLabels: Record<number, string | undefined> = {
  10: "IAR",
  30: "Evidence",
  50: "EndOfProjectSurvey",
  60: "StatementOfExpenditure",
  110: "LMCMinutes",
  120: "ScheduleThree",
};
const stubUnknownDocumentLabel = "description.unknown";

const stubHookContent = {
  claimDocuments: {
    documents: {
      labels: {
        documentDescriptionLabel: jest.fn((x: number) => ({
          content: stubLabels[x] || stubUnknownDocumentLabel,
        })),
      },
    },
  },
} as any;

describe("<EnumDocuments />", () => {
  beforeEach(jest.clearAllMocks);

  const spy = jest.spyOn(hook, "useEnumDocuments");

  const elementId = "get-data-length";

  const setupComponent = () =>
    render(
      <TestBed content={stubHookContent}>
        <EnumDocuments documentsToCheck={[]}>{data => <div data-qa={elementId}>{data.length}</div>}</EnumDocuments>
      </TestBed>,
    );

  const populatedDocs = [
    { id: "id-iar", value: "IAR" },
    { id: "id-evidence", value: "Evidence" },
    { id: "id-endofprojectsurvey", value: "EndOfProjectSurvey" },
  ];

  test.each`
    name                                       | docs             | expectedDocLength
    ${"returns documents via render props"}    | ${populatedDocs} | ${populatedDocs.length}
    ${"returns no documents via render props"} | ${[]}            | ${0}
  `("$name", ({ docs, expectedDocLength }) => {
    spy.mockReturnValue(docs);

    const { getByTestId } = setupComponent();

    const result = getByTestId(elementId);
    const renderPropsDocumentCount: number = Number(result.innerHTML);

    expect(renderPropsDocumentCount).toBe(expectedDocLength);
  });
});
