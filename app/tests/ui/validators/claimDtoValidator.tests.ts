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

      describe("when claim is a final claim non-ktp competition type", () => {
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

        describe("when IAR is not required", () => {
          test.each`
            name                                                     | stubClaim                                                   | expectedError
            ${"when IAR + PCF status is not received"}               | ${{ iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${"You must upload a project completion form before you can submit this claim."}
            ${"when IAR is not received and PCF status is received"} | ${{ iarStatus: "Not Received", pcfStatus: "Received" }}     | ${null}
            ${"when IAR is received and PCF status is not received"} | ${{ iarStatus: "Received", pcfStatus: "Not Received" }}     | ${"You must upload a project completion form before you can submit this claim."}
          `("$name", ({ stubClaim, expectedError }) => {
            const hasNoError: boolean = expectedError === null;
            const stubFinalClaim = {
              ...stubClaimDto,
              ...stubClaim,
              isIarRequired: false,
              isFinalClaim: true,
            } as ClaimDto;

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
      });

      describe("when claim is a final claim and is a Ktp competition", () => {
        const ktpCompetitionType = "KTP";

        test.each`
          name                                                                           | stubClaim                                              | stubDocuments     | expectedToBeValid | expectedErrorMessage
          ${"with not required IAR and not received valid IAR status with documents"}    | ${{ isIarRequired: false, iarStatus: "Not Received" }} | ${[stubDocument]} | ${true}           | ${null}
          ${"with not required IAR and not received valid IAR status without documents"} | ${{ isIarRequired: false, iarStatus: "Not Received" }} | ${[]}             | ${true}           | ${null}
          ${"with required IAR and valid IAR status with documents"}                     | ${{ isIarRequired: true, iarStatus: "Received" }}      | ${[stubDocument]} | ${true}           | ${null}
          ${"with required IAR and valid IAR status without documents"}                  | ${{ isIarRequired: true, iarStatus: "Received" }}      | ${[]}             | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
          ${"with required IAR and invalid IAR status with documents"}                   | ${{ isIarRequired: true, iarStatus: "Not Received" }}  | ${[stubDocument]} | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
          ${"with required IAR and invalid IAR status without documents"}                | ${{ isIarRequired: true, iarStatus: "Not Received" }}  | ${[]}             | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
        `("$name as KTP competition", ({ stubClaim, stubDocuments, expectedToBeValid, expectedErrorMessage }) => {
          const stubFinalClaim = {
            ...stubClaimDto,
            ...stubClaim,
            isFinalClaim: true,
          } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubOriginalStatus,
            [],
            stubDocuments,
            stubShowErrors,
            ktpCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(expectedToBeValid);

          if (!claimState.isValid || expectedErrorMessage) {
            expect(claimState.errorMessage).toBe(expectedErrorMessage);
          }
        });
      });

      describe("when claim not a final claim", () => {
        const ktpCompetitionType = "KTP";

        test.each`
          name                                                                                       | stubClaim                                             | stubDocuments     | testCompetitionType    | expectedToBeValid | expectedErrorMessage
          ${"with required IAR and valid IAR status with documents as non-KTP competition"}          | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[stubDocument]} | ${stubCompetitionType} | ${true}           | ${null}
          ${"with required IAR and valid IAR status without documents as non-KTP competition"}       | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[]}             | ${stubCompetitionType} | ${false}          | ${"You must upload an independent accountant's report before you can submit this claim."}
          ${"with required IAR and invalid IAR status with documents as non-KTP competition"}        | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[stubDocument]} | ${stubCompetitionType} | ${false}          | ${"You must upload an independent accountant's report before you can submit this claim."}
          ${"with required IAR and invalid IAR status without documents as non-KTP competition"}     | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[]}             | ${stubCompetitionType} | ${false}          | ${"You must upload an independent accountant's report before you can submit this claim."}
          ${"with non required IAR and a valid IAR status without documents as non-KTP competition"} | ${{ isIarRequired: false, iarStatus: "Received" }}    | ${[]}             | ${stubCompetitionType} | ${true}           | ${null}
          ${"with non required IAR and a valid IAR status with documents as non-KTP competition"}    | ${{ isIarRequired: false, iarStatus: "Received" }}    | ${[stubDocument]} | ${stubCompetitionType} | ${true}           | ${null}
          ${"with required IAR and valid IAR status with documents as KTP competition"}              | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[stubDocument]} | ${ktpCompetitionType}  | ${true}           | ${null}
          ${"with required IAR and valid IAR status without documents as KTP competition"}           | ${{ isIarRequired: true, iarStatus: "Received" }}     | ${[]}             | ${ktpCompetitionType}  | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
          ${"with required IAR and invalid IAR status with documents as KTP competition"}            | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[stubDocument]} | ${ktpCompetitionType}  | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
          ${"with required IAR and invalid IAR status without documents as KTP competition"}         | ${{ isIarRequired: true, iarStatus: "Not Received" }} | ${[]}             | ${ktpCompetitionType}  | ${false}          | ${"You must upload a schedule 3 before you can submit this claim."}
        `("$name", ({ stubClaim, stubDocuments, testCompetitionType, expectedToBeValid, expectedErrorMessage }) => {
          const stubFinalClaim = {
            ...stubClaimDto,
            ...stubClaim,
            isFinalClaim: false,
          } as ClaimDto;

          const { claimState } = new ClaimDtoValidator(
            stubFinalClaim,
            stubOriginalStatus,
            [],
            stubDocuments,
            stubShowErrors,
            testCompetitionType,
            true,
          );

          expect(claimState.isValid).toBe(expectedToBeValid);

          if (!claimState.isValid || expectedErrorMessage) {
            expect(claimState.errorMessage).toBe(expectedErrorMessage);
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
        });
      });
    });

    describe("when status is awaiting IAR", () => {
      const stubAwaitingIarStatus = ClaimStatus.AWAITING_IAR;
      const stubFinalAwaitingIarClaim = { ...stubClaimDto, status: ClaimStatus.AWAITING_IAR } as ClaimDto;

      describe("when the final claim", () => {
        describe("when not KTP", () => {
          const nonKtpCompetitionType = "CATAPULTS";

          test.each`
            name                                                                  | testClaimDto                                                                      | expectedState | expectedErrorMessage
            ${"with required IAR with IAR status is valid and not PCF"}           | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Not Received" }}      | ${false}      | ${"You must upload a project completion form before you can submit this claim."}
            ${"with required IAR with PCF status is valid and not iar"}           | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Received" }}      | ${false}      | ${"You must upload an independent accountant's report before you can submit this claim."}
            ${"with required IAR with IAR and PCF statuses are invalid"}          | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Not Received" }}  | ${false}      | ${"You must upload an independent accountant's report and a project completion form before you can submit this claim."}
            ${"with required IAR with IAR and PCF statuses are valid"}            | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Received" }}          | ${true}       | ${null}
            ${"with non required IAR with IAR and PCF statuses are not received"} | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${false}      | ${"You must upload a project completion form before you can submit this claim."}
            ${"with non required IAR with PCF received but not IAR"}              | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Received" }}     | ${true}       | ${null}
            ${"with non required IAR with IAR and PCF received"}                  | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Received" }}         | ${true}       | ${null}
            ${"with non required IAR with IAR received but not PCF"}              | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Not Received" }}     | ${false}      | ${"You must upload a project completion form before you can submit this claim."}
          `("$name", ({ testClaimDto, expectedState, expectedErrorMessage }) => {
            const stubFinalClaim = {
              ...stubFinalAwaitingIarClaim,
              ...testClaimDto,
              isFinalClaim: true,
            } as ClaimDto;

            const { claimState } = new ClaimDtoValidator(
              stubFinalClaim,
              stubAwaitingIarStatus,
              [],
              [stubDocument],
              stubShowErrors,
              nonKtpCompetitionType,
              true,
            );

            expect(claimState.isValid).toBe(expectedState);

            if (expectedErrorMessage) {
              expect(claimState.errorMessage).toBe(expectedErrorMessage);
            }
          });
        });

        describe("when KTP", () => {
          const ktpCompetitionType = "KTP";

          test.each`
            name                                                             | testClaimDto                                                                      | expectedState | expectedErrorMessage
            ${"with IAR required when iar status is valid and not pcf"}      | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Not Received" }}      | ${true}       | ${null}
            ${"with IAR required when iar and pcf statuses are valid"}       | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Received" }}          | ${true}       | ${null}
            ${"with IAR required when iar and pcf statuses are invalid"}     | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Not Received" }}  | ${false}      | ${"You must upload a schedule 3 before you can submit this claim."}
            ${"with IAR required when pcf status is valid and not iar"}      | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Received" }}      | ${false}      | ${"You must upload a schedule 3 before you can submit this claim."}
            ${"with IAR not required when iar status is valid and not pcf"}  | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Not Received" }}     | ${true}       | ${null}
            ${"with IAR not required when iar and pcf statuses are valid"}   | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Received" }}         | ${true}       | ${null}
            ${"with IAR not required when iar and pcf statuses are invalid"} | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${true}       | ${null}
            ${"with IAR not required when pcf status is valid and not iar"}  | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Received" }}     | ${true}       | ${null}
          `("$name", ({ testClaimDto, expectedState, expectedErrorMessage }) => {
            const stubFinalClaim = {
              ...stubFinalAwaitingIarClaim,
              ...testClaimDto,
              isFinalClaim: true,
            } as ClaimDto;

            const { claimState } = new ClaimDtoValidator(
              stubFinalClaim,
              stubAwaitingIarStatus,
              [],
              [stubDocument],
              stubShowErrors,
              ktpCompetitionType,
              true,
            );

            expect(claimState.isValid).toBe(expectedState);

            if (!claimState.isValid || expectedErrorMessage) {
              expect(claimState.errorMessage).toBe(expectedErrorMessage);
            }
          });
        });

        describe("when ktp project competition", () => {
          test.each`
            name              | testClaimDto                     | expectedState | expectedError
            ${"when valid"}   | ${{ iarStatus: "Received" }}     | ${true}       | ${""}
            ${"when invalid"} | ${{ iarStatus: "Not Received" }} | ${false}      | ${"You must upload a schedule 3 before you can submit this claim."}
          `("when iar required and status $name", ({ testClaimDto, expectedState, expectedError }) => {
            const stubKtpCompetition = "KTP";
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
              stubKtpCompetition,
              true,
            );

            expect(claimState.isValid).toBe(expectedState);

            if (expectedError) {
              expect(claimState.errorMessage).toBe(expectedError);
            }
          });
        });
      });

      describe("when not the final claim", () => {
        const ktpCompetitionType = "KTP";

        test.each`
          name                                                                     | testClaimDto                     | testCompetitionType    | expectedState | expectedErrorMessage
          ${"when IAR required with IAR status is valid"}                          | ${{ iarStatus: "Received" }}     | ${stubCompetitionType} | ${true}       | ${null}
          ${"when IAR required with IAR statuses is invalid when not KTP project"} | ${{ iarStatus: "Not Received" }} | ${stubCompetitionType} | ${false}      | ${"You must upload an independent accountant's report before you can submit this claim."}
          ${"when IAR required with IAR statuses is invalid when a KTP project"}   | ${{ iarStatus: "Not Received" }} | ${ktpCompetitionType}  | ${false}      | ${"You must upload a schedule 3 before you can submit this claim."}
        `("$name", ({ testClaimDto, testCompetitionType, expectedState, expectedErrorMessage }) => {
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

          if (!claimState.isValid || expectedErrorMessage) {
            expect(claimState.errorMessage).toBe(expectedErrorMessage);
          }
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
