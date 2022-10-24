import { renderHook } from "@testing-library/react";

import { DocumentDescription } from "@framework/types";

import { hookTestBed } from "@shared/TestBed";
import { useEnumDocuments } from "@ui/containers/claims/components/allowed-documents.hook";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("useEnumDocuments()", () => {
  enum stubDocumentDescriptions {
    IAR = 10,
    Evidence = 30,
    StatementOfExpenditure = 60,
    LMCMinutes = 110,
    ScheduleThree = 120,
    Invoice = 210,
  }

  enum stubUnknownDocumentDescriptions {
    Unknown = 3821,
  }

  const claimAllowedDocuments: Readonly<DocumentDescription[]> = [
    DocumentDescription.IAR,
    DocumentDescription.Evidence,
    DocumentDescription.StatementOfExpenditure,
    DocumentDescription.LMCMinutes,
    DocumentDescription.ScheduleThree,
    DocumentDescription.Invoice,
  ];

  const stubContent = {
    documentLabels: {
      description: {
        iar: "stub-IAR",
        evidence: "stub-Evidence",
        statementOfExpenditure: "stub-StatementOfExpenditure",
        lmcMinutes: "stub-LMCMinutes",
        scheduleThree: "stub-ScheduleThree",
        invoice: "stub-Invoice",
        unknown: "stub-unknown",
      },
    },
  };

  const setup = (enumDocument: object) => {
    return renderHook(() => useEnumDocuments(enumDocument, claimAllowedDocuments), hookTestBed({}));
  };

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

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
});
