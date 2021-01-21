import { renderHook } from "@testing-library/react-hooks";

import { DocumentDescription } from "@framework/types";

import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { useEnumDocuments } from "@ui/containers/claims/components/allowed-documents.hook";

enum stubDocumentDescriptions {
  IAR = 10,
  Evidence = 30,
  EndOfProjectSurvey = 50,
  StatementOfExpenditure = 60,
  LMCMinutes = 110,
}

const claimAllowedDocuments: DocumentDescription[] = [
  DocumentDescription.IAR,
  DocumentDescription.Evidence,
  DocumentDescription.EndOfProjectSurvey,
  DocumentDescription.StatementOfExpenditure,
  DocumentDescription.LMCMinutes,
  DocumentDescription.ScheduleThree,
];

const stubLabels: Record<number, string | undefined> = {
  10: "IAR",
  30: "Evidence",
  50: "EndOfProjectSurvey",
  60: "StatementOfExpenditure",
  110: "LMCMinutes",
  120: "ScheduleThree",
};
const stubUnknownDocumentLabel = "description.unknown";

const stubHookContent = (labels: Record<number, string | undefined> = stubLabels) =>
  ({
    claimDocuments: {
      documents: {
        labels: {
          documentDescriptionLabel: jest.fn((x: number) => ({
            content: labels[x] || stubUnknownDocumentLabel,
          })),
        },
      },
    },
  } as any);

describe("useEnumDocuments", () => {
  const setup = (enumDocument: object, content: TestBedContent) =>
    renderHook(() => useEnumDocuments(enumDocument, claimAllowedDocuments), hookTestBed({ content }));

  test("returns the correct array length", () => {
    const val = setup(stubDocumentDescriptions, stubHookContent());
    const expectedLength: number = Object.keys(stubDocumentDescriptions).length / 2;

    expect(val.result.current).toHaveLength(expectedLength);
  });

  test("returns back with 1 missing array item (not found)", () => {
    enum stubMissingLabelDocuments {
      IAR = 10,
      Evidence = 30,
      EndOfProjectSurvey = 50,
      StatementOfExpenditure = 60,
      LMCMinutes = 110,
      Description_with_no_available_label = 10000000,
    }

    const val = setup(stubMissingLabelDocuments, stubHookContent());
    const totalDataLength: number = Object.keys(stubMissingLabelDocuments).length / 2;
    const expectedLength = totalDataLength - 1;

    expect(val.result.current).toHaveLength(expectedLength);
  });

  test("returns back with 1 unknown value", () => {
    const missingLabelStub = {
      ...stubLabels,
      [stubDocumentDescriptions.IAR]: undefined,
    };

    const val = setup(stubDocumentDescriptions, stubHookContent(missingLabelStub));
    const totalUnknownValues = val.result.current.filter(x => x.value === stubUnknownDocumentLabel);

    expect(totalUnknownValues).toHaveLength(1);
  });
});
