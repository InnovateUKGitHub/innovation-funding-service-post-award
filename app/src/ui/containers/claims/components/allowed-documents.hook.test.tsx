import { renderHook } from "@testing-library/react-hooks";

import { DocumentDescription } from "@framework/types";

import { hookTestBed, TestBedContent } from "@shared/TestBed";
import { useEnumDocuments } from "@ui/containers/claims/components/allowed-documents.hook";

describe("useEnumDocuments()", () => {
  enum stubDocumentDescriptions {
    IAR = 10,
    Evidence = 30,
    StatementOfExpenditure = 60,
    LMCMinutes = 110,
    ScheduleThree = 120,
    Invoice = 210,
  }

  const claimAllowedDocuments: Readonly<DocumentDescription[]> = [
    DocumentDescription.IAR,
    DocumentDescription.Evidence,
    DocumentDescription.StatementOfExpenditure,
    DocumentDescription.LMCMinutes,
    DocumentDescription.ScheduleThree,
    DocumentDescription.Invoice,
  ];

  const stubLabels: Record<number, string | undefined> = {
    10: "IAR",
    30: "Evidence",
    60: "StatementOfExpenditure",
    110: "LMCMinutes",
    120: "ScheduleThree",
    210: "Invoice",
  };

  const stubUnknownDocumentLabel = "description.unknown";

  const setup = (enumDocument: object, labelOverride = stubLabels) => {
    const content = ({
      claimDocuments: {
        documents: {
          labels: {
            documentDescriptionLabel: jest.fn((x: number) => ({
              content: labelOverride[x] || stubUnknownDocumentLabel,
            })),
          },
        },
      },
    } as any) as TestBedContent;

    return renderHook(() => useEnumDocuments(enumDocument, claimAllowedDocuments), hookTestBed({ content }));
  };

  test("returns the correct array length", () => {
    // Note: Total keys here should match length below
    enum stubDescriptions {
      IAR = 10,
      Evidence = 30,
      StatementOfExpenditure = 60,
      LMCMinutes = 110,
      ScheduleThree = 120,
      Invoice = 210,
    }

    const { result } = setup(stubDescriptions);

    expect(result.current).toHaveLength(6);
  });

  test("returns back with 1 missing array item (not found)", () => {
    enum stubMissingLabelDocuments {
      IAR = 10,
      Evidence = 30,
      StatementOfExpenditure = 60,
      LMCMinutes = 110,
      Description_with_no_available_label = 123456789,
    }

    const { result } = setup(stubMissingLabelDocuments);

    // Note: This value should be a total count of keys from "stubMissingLabelDocuments" minus 1 invalid item!
    expect(result.current).toHaveLength(4);

    // Note: Lets ensure that the array is correct but the invalid item did not filter through!
    const queryInvalidDocumentLabel = result.current.find(
      x => x.id === String(stubMissingLabelDocuments.Description_with_no_available_label),
    );

    expect(queryInvalidDocumentLabel).toBeUndefined();
  });

  test("returns back with 1 unknown value", () => {
    const stubMissingLabel: Record<number, string | undefined> = {
      10: undefined,
      30: "Evidence",
      60: "StatementOfExpenditure",
      110: "LMCMinutes",
      120: "ScheduleThree",
      210: "Invoice",
    };

    const { result } = setup(stubDocumentDescriptions, stubMissingLabel);

    const totalUnknownValues = result.current.find(x => x.value === stubUnknownDocumentLabel);

    expect(totalUnknownValues).toBeDefined();

    // Note: Lets ensure that the array is correct but the invalid item did not filter through!
    const queryInvalidDocumentLabel = result.current.find(x => x.id === String(stubMissingLabel[10]));

    expect(queryInvalidDocumentLabel).toBeUndefined();
  });
});
