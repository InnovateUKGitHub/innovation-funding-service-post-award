import { ClaimStatus } from "@framework/constants";
import { ClaimDto, DocumentSummaryDto } from "@framework/dtos";
import { ClaimDtoValidator } from "@ui/validators";

describe("claimDtoValidator()", () => {
  const stubClaimDto = { id: "stub-id", status: ClaimStatus.UNKNOWN } as ClaimDto;
  const stubOriginalStatus = ClaimStatus.DRAFT;
  const stubDocument = { fileName: "stub-fileName" } as DocumentSummaryDto;
  const stubShowErrors = true;
  const stubCompetitionType = "CR&D";
  const stubIsFinalSummary = true;
  const stubIsNotFinalSummary = false;

  describe("with status", () => {
    type ClaimStatusKeys = keyof typeof ClaimStatus;

    // Note: Convert enum to array like data structure
    const claimStatusKeys = Object.values(ClaimStatus);
    const forbiddenStatuses: ClaimStatus[] = claimStatusKeys.filter(
      x => !ClaimDtoValidator.permittedStatuses.includes(x),
    );

    // Note: Create quick look map for quick assignment
    const claimStatusKeyValuePairs = Object.entries(ClaimStatus) as [ClaimStatusKeys, ClaimStatus][];
    const claimStatusMap = new Map<ClaimStatus, ClaimStatusKeys>(
      claimStatusKeyValuePairs.map(([key, value]) => [value, key]),
    );

    // Note: Create automatically generated collections to test on. If a new item is added this update based validator
    const permittedClaimStatuses = new Map<ClaimStatus, ClaimStatusKeys>();
    const forbiddenClaimStatuses = new Map<ClaimStatus, ClaimStatusKeys>();

    // Note: Populate collections based on validator static instance
    for (const statusKey of claimStatusKeys) {
      const isInvalidStatus = forbiddenStatuses.includes(statusKey);
      const mapToUpdate = isInvalidStatus ? forbiddenClaimStatuses : permittedClaimStatuses;
      const statusValue = claimStatusMap.get(statusKey) as ClaimStatusKeys;

      mapToUpdate.set(statusKey, statusValue);
    }

    describe("when invalid claim status", () => {
      forbiddenClaimStatuses.forEach((value, key) => {
        const claimKey = key || "Unknown";

        test(`when ${claimKey}`, () => {
          const claimWithInValidStatus: ClaimDto = { ...stubClaimDto, status: ClaimStatus[value] };

          const { status } = new ClaimDtoValidator(
            claimWithInValidStatus,
            stubOriginalStatus,
            [],
            [],
            stubShowErrors,
            stubCompetitionType,
          );

          expect(status.isValid).toBeFalsy();

          expect(status.errorMessage).toBe(`The claim status '${claimKey}' is not permitted to continue.`);
        });
      });
    });

    describe("with a valid status", () => {
      permittedClaimStatuses.forEach((value, key) => {
        test(`when ${key}`, () => {
          const claimWithValidStatus: ClaimDto = { ...stubClaimDto, status: ClaimStatus[value] };

          const { status } = new ClaimDtoValidator(
            claimWithValidStatus,
            stubOriginalStatus,
            [],
            [],
            stubShowErrors,
            stubCompetitionType,
          );

          expect(status.isValid).toBeTruthy();
        });
      });
    });
  });

  describe("with id", () => {
    test("when valid", () => {
      const { id } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(id.isValid).toBeTruthy();
    });

    test("when invalid", () => {
      const invalidIdClaim = { ...stubClaimDto, id: "" } as ClaimDto;

      const { id } = new ClaimDtoValidator(
        invalidIdClaim,
        stubOriginalStatus,
        [],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(id.isValid).toBeFalsy();
      expect(id.errorMessage).toBe("Id is required");
    });
  });

  describe("with claimState", () => {
    describe("as default", () => {
      describe("should bail from validation", () => {
        test.each`
          name                         | inboundCompetitionType | inboundIsClaimSummary
          ${"when not a final claim"}  | ${"CR&D"}              | ${false}
          ${"when competition is KTP"} | ${"KTP"}               | ${true}
        `("$name", ({ inboundCompetitionType, inboundIsClaimSummary }) => {
          const { claimState } = new ClaimDtoValidator(
            stubClaimDto,
            stubOriginalStatus,
            [],
            [],
            stubShowErrors,
            inboundCompetitionType,
            inboundIsClaimSummary,
          );

          expect(claimState.isValid).toBeTruthy();
        });

        test("when IAR Required is not set / false", () => {
          const stubNotKtpCompetition = "CR&D";
          const stubNoIarClaim = { ...stubClaimDto, isIarRequired: false } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubNoIarClaim,
            stubOriginalStatus,
            [],
            [],
            stubShowErrors,
            stubNotKtpCompetition,
            stubIsFinalSummary,
          );

          expect(claimState.isValid).toBeTruthy();
        });
      });

      describe("when claim is a final claim", () => {
        test.each`
          name                            | stubClaim                                            | expectedError
          ${"when pcf status is valid"}   | ${{ isFinalClaim: true, pcfStatus: "Received" }}     | ${null}
          ${"when pcf status is invalid"} | ${{ isFinalClaim: true, pcfStatus: "Not Received" }} | ${"You must upload a project completion form before you can submit this claim."}
        `("$name", ({ stubClaim, expectedError }) => {
          const hasNoError: boolean = expectedError === null;
          const stubFinalClaim = { ...stubClaimDto, ...stubClaim } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubOriginalStatus,
            [],
            [],
            stubShowErrors,
            stubCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(hasNoError);

          if (!hasNoError) {
            expect(claimState.errorMessage).toBe(expectedError);
          }
        });
      });

      describe("when claim not a final claim", () => {
        test.each`
          name                                           | stubClaim                        | stubDocuments     | expectedToBeValid
          ${"with valid pcf status with documents"}      | ${{ iarStatus: "Received" }}     | ${[stubDocument]} | ${true}
          ${"with valid pcf status without documents"}   | ${{ iarStatus: "Received" }}     | ${[]}             | ${false}
          ${"with invalid pcf status with documents"}    | ${{ iarStatus: "Not Received" }} | ${[stubDocument]} | ${false}
          ${"with invalid pcf status without documents"} | ${{ iarStatus: "Not Received" }} | ${[]}             | ${false}
        `("$name", ({ stubClaim, stubDocuments, expectedToBeValid }) => {
          const stubFinalClaim = {
            ...stubClaimDto,
            ...stubClaim,
            isFinalClaim: false,
            isIarRequired: true,
          } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubOriginalStatus,
            [],
            stubDocuments,
            stubShowErrors,
            stubCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(expectedToBeValid);

          if (!expectedToBeValid) {
            expect(claimState.errorMessage).toBe(
              "You must upload an independent accountant's report before you can submit this claim.",
            );
          }
        });

        describe("with iar required states", () => {
          describe("should bail from validation", () => {
            test.each`
              name                                | testClaimDto                | competitionTypeArg     | isFinalClaimArg | expectedState
              ${"when not a final claim summary"} | ${{}}                       | ${stubCompetitionType} | ${false}        | ${true}
              ${"when not a KTP competition"}     | ${{}}                       | ${"LOANS"}             | ${true}         | ${true}
              ${"when not iar required"}          | ${{ isIarRequired: false }} | ${stubCompetitionType} | ${true}         | ${true}
            `("$name", ({ testClaimDto, competitionTypeArg, isFinalClaimArg, expectedState }) => {
              const stubIarClaim = { ...stubClaimDto, ...testClaimDto } as ClaimDto;

              const { claimState } = new ClaimDtoValidator(
                stubIarClaim,
                stubOriginalStatus,
                [],
                [],
                stubShowErrors,
                competitionTypeArg,
                isFinalClaimArg,
              );

              expect(claimState.isValid).toBe(expectedState);
            });
          });

          describe("with correct validation", () => {
            const isKtpCompetition = "KTP";

            test.each`
              name                                          | testClaimDto                                          | testDocuments     | expectedState
              ${"with valid iar claim with documents"}      | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[stubDocument]} | ${true}
              ${"with valid iar claim without documents"}   | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[]}             | ${false}
              ${"with invalid iar claim with documents"}    | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[stubDocument]} | ${false}
              ${"with invalid iar claim without documents"} | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[]}             | ${false}
            `("$name", ({ testClaimDto, testDocuments, expectedState }) => {
              const stubIarClaim = { ...stubClaimDto, ...testClaimDto } as ClaimDto;

              const { claimState } = new ClaimDtoValidator(
                stubIarClaim,
                stubOriginalStatus,
                [],
                testDocuments,
                stubShowErrors,
                isKtpCompetition,
                true,
              );

              expect(claimState.isValid).toBe(expectedState);

              if (!expectedState) {
                expect(claimState.errorMessage).toBe("You must upload a schedule 3 before you can submit this claim.");
              }
            });
          });
        });
      });
    });

    describe("when status is awaiting IAR", () => {
      const stubAwaitingIarStatus = ClaimStatus.AWAITING_IAR;
      const stubFinalAwaitingIarClaim = { ...stubClaimDto, status: ClaimStatus.AWAITING_IAR } as ClaimDto;

      describe("when the final claim", () => {
        test.each`
          name                                       | testClaimDto                                                | expectedState
          ${"with iar status is valid and not pcf"}  | ${{ iarStatus: "Received", pcfStatus: "Not Received" }}     | ${false}
          ${"with pcf status is valid and not iar"}  | ${{ iarStatus: "Not Received", pcfStatus: "Received" }}     | ${false}
          ${"with iar and pcf statuses are invalid"} | ${{ iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${false}
          ${"with iar and pcf statuses are valid"}   | ${{ iarStatus: "Received", pcfStatus: "Received" }}         | ${true}
        `("$name", ({ testClaimDto, expectedState }) => {
          const stubFinalClaim = {
            ...stubFinalAwaitingIarClaim,
            ...testClaimDto,
            isFinalClaim: true,
            isIarRequired: true,
          } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubAwaitingIarStatus,
            [],
            [stubDocument],
            stubShowErrors,
            stubCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(expectedState);
        });
      });

      describe("when not the final claim", () => {
        test.each`
          name                                                   | testClaimDto                     | testCompetitionType    | expectedState
          ${"with iar status is valid"}                          | ${{ iarStatus: "Received" }}     | ${stubCompetitionType} | ${true}
          ${"with iar statuses is invalid when not KTP project"} | ${{ iarStatus: "Not Received" }} | ${stubCompetitionType} | ${false}
          ${"with iar statuses is invalid when a KTP project"}   | ${{ iarStatus: "Not Received" }} | ${"KTP"}               | ${false}
        `("$name", ({ testClaimDto, testCompetitionType, expectedState }) => {
          const stubFinalClaim = {
            ...stubFinalAwaitingIarClaim,
            ...testClaimDto,
            isFinalClaim: false,
            isIarRequired: true,
          } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubAwaitingIarStatus,
            [],
            [stubDocument],
            stubShowErrors,
            testCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(expectedState);
        });
      });
    });
  });

  describe("with comments", () => {
    describe("with correct claim status", () => {
      test.each`
        name                                                                    | testClaimDto                                                            | testOriginalStatus        | expectedToBeValid
        ${"with correct status and original status"}                            | ${{ status: ClaimStatus.MO_QUERIED, comments: "must-contain-a-value" }} | ${ClaimStatus.DRAFT}      | ${true}
        ${"with an incorrect status and valid original status but no comments"} | ${{ status: ClaimStatus.DRAFT, comments: "must-contain-a-value" }}      | ${ClaimStatus.DRAFT}      | ${true}
        ${"with correct status and original status but no comments"}            | ${{ status: ClaimStatus.MO_QUERIED, comments: "" }}                     | ${ClaimStatus.DRAFT}      | ${false}
        ${"with correct status and original status but no comments"}            | ${{ status: ClaimStatus.MO_QUERIED, comments: "must-contain-a-value" }} | ${ClaimStatus.MO_QUERIED} | ${true}
      `("$name", ({ testClaimDto, testOriginalStatus, expectedToBeValid }) => {
        const stubCommentsClaim = { ...stubClaimDto, ...testClaimDto } as ClaimDto;

        const { comments } = new ClaimDtoValidator(
          stubCommentsClaim,
          testOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsNotFinalSummary,
        );

        expect(comments.isValid).toBe(expectedToBeValid);

        if (!expectedToBeValid) {
          expect(comments.errorMessage).toBe("Comments are required if querying a claim");
        }
      });
    });

    describe("with correct length validation", () => {
      test.each`
        name                                      | testCommentValue    | expectedToBeValid
        ${"with max comment length of 1000"}      | ${"_".repeat(1000)} | ${true}
        ${"with an exceeding max comment length"} | ${"_".repeat(1001)} | ${false}
      `("$name", ({ testCommentValue, expectedToBeValid }) => {
        const stubCommentClaim = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: testCommentValue,
        } as ClaimDto;

        const { comments } = new ClaimDtoValidator(
          stubCommentClaim,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsNotFinalSummary,
        );

        expect(comments.isValid).toBe(expectedToBeValid);

        if (!expectedToBeValid) {
          expect(comments.errorMessage).toBe("Comments must be a maximum of 1000 characters");
        }
      });
    });
  });

  describe("with totalCosts", () => {
    test.each`
      name                                                     | testClaimDetails                                              | expectedToBeValid
      ${"when total costs are valid"}                          | ${[{ remainingOfferCosts: 1 }]}                               | ${true}
      ${"when all total costs accumulate to a positive total"} | ${[{ remainingOfferCosts: 5 }, { remainingOfferCosts: 5 }]}   | ${true}
      ${"when total costs are zero"}                           | ${[{ remainingOfferCosts: 0 }]}                               | ${true}
      ${"when total costs are negative"}                       | ${[{ remainingOfferCosts: -1 }]}                              | ${false}
      ${"when all total costs accumulate to a negative total"} | ${[{ remainingOfferCosts: 5 }, { remainingOfferCosts: -10 }]} | ${false}
    `("$name", ({ testClaimDetails, expectedToBeValid }) => {
      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        testClaimDetails,
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBe(expectedToBeValid);

      if (!expectedToBeValid) {
        expect(totalCosts.errorMessage).toBe(
          "You must reduce your claim to ensure the remaining eligible costs are zero or higher.",
        );
      }
    });
  });
});
