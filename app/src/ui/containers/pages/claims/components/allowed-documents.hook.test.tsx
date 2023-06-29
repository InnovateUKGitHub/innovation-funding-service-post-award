import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { useEnumDocuments } from "@ui/containers/pages/claims/components/allowed-documents.hook";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { DocumentDescription } from "@framework/constants/documentDescription";

describe("useEnumDocuments()", () => {
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

  /**
   * setup function taking enum documents generic
   */
  function setup() {
    return renderHook(() => useEnumDocuments(claimAllowedDocuments), hookTestBed({}));
  }

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  test("returns the correct array length", () => {
    // Note: Total keys here should match length below

    const { result } = setup();

    expect(result.current).toHaveLength(6);
  });
});
