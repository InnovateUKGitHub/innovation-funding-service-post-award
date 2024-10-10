import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimDto } from "@framework/dtos/claimDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { initFullTestIntl, initStubTestIntl } from "@shared/initStubTestIntl";
import { ClaimDtoValidator } from "./claimDtoValidator";
import { ReceivedStatus } from "@framework/entities/received-status";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRolePermissionBits } from "@framework/constants/project";

describe("claimDtoValidator()", () => {
  describe.each(["en-GB", "no"])("With %s i18n", language => {
    beforeAll(async () => {
      if (language === "en-GB") {
        await initFullTestIntl();
      } else {
        await initStubTestIntl();
      }
    });

    const stubClaimDto = { id: "stub-id", status: ClaimStatus.UNKNOWN } as ClaimDto;
    const stubOriginalStatus = ClaimStatus.DRAFT;
    const stubDocument = { fileName: "stub-fileName" } as DocumentSummaryDto;
    const stubIar: DocumentSummaryDto = { ...stubDocument, description: DocumentDescription.IAR };
    const stubScheduleThree: DocumentSummaryDto = { ...stubDocument, description: DocumentDescription.ScheduleThree };
    // const stubPcf: DocumentSummaryDto = { ...stubDocument, description: DocumentDescription.ProjectCompletionForm };

    const stubShowErrors = true;
    const stubCompetitionType = "CR&D";

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
              ProjectRolePermissionBits.FinancialContact,
            );

            expect(status.isValid).toBeFalsy();
            expect(status.errorMessage).toMatchSnapshot();
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
              ProjectRolePermissionBits.FinancialContact,
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
          ProjectRolePermissionBits.FinancialContact,
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
          ProjectRolePermissionBits.FinancialContact,
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
              ProjectRolePermissionBits.FinancialContact,
            );

            expect(claimState.isValid).toBeTruthy();
          });
        });

        describe("when claim is a final claim non-ktp competition type", () => {
          test.each`
            name                               | role                                           | stubClaim                                            | hasError
            ${"when fc pcf status is valid"}   | ${ProjectRolePermissionBits.FinancialContact}  | ${{ isFinalClaim: true, pcfStatus: "Received" }}     | ${false}
            ${"when fc pcf status is invalid"} | ${ProjectRolePermissionBits.FinancialContact}  | ${{ isFinalClaim: true, pcfStatus: "Not Received" }} | ${true}
            ${"when mo pcf status is valid"}   | ${ProjectRolePermissionBits.MonitoringOfficer} | ${{ isFinalClaim: true, pcfStatus: "Received" }}     | ${false}
            ${"when mo pcf status is invalid"} | ${ProjectRolePermissionBits.MonitoringOfficer} | ${{ isFinalClaim: true, pcfStatus: "Not Received" }} | ${false}
          `("$name", ({ role, stubClaim, hasError }) => {
            const stubFinalClaim = { ...stubClaimDto, ...stubClaim } as ClaimDto;

            const { claimState } = new ClaimDtoValidator(
              stubFinalClaim,
              stubOriginalStatus,
              [],
              [],
              stubShowErrors,
              stubCompetitionType,
              role,
            );

            expect(claimState.isValid).toBe(!hasError);
            expect(claimState.errorMessage).toMatchSnapshot();
          });

          describe("when IAR is not required", () => {
            test.each`
              name                                                     | stubClaim                                                   | hasError
              ${"when IAR + PCF status is not received"}               | ${{ iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${true}
              ${"when IAR is not received and PCF status is received"} | ${{ iarStatus: "Not Received", pcfStatus: "Received" }}     | ${false}
              ${"when IAR is received and PCF status is not received"} | ${{ iarStatus: "Received", pcfStatus: "Not Received" }}     | ${true}
            `("$name", ({ stubClaim, hasError }) => {
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
                ProjectRolePermissionBits.FinancialContact,
              );

              expect(claimState.isValid).toBe(!hasError);
              expect(claimState.errorMessage).toMatchSnapshot();
            });
          });
        });

        describe("when claim is a final claim and is a Ktp competition", () => {
          const ktpCompetitionType = "KTP";

          test.each`
            name                                                                           | stubClaim                                              | stubDocuments          | expectedToBeValid
            ${"with not required IAR and not received valid IAR status with documents"}    | ${{ isIarRequired: false, iarStatus: "Not Received" }} | ${[stubScheduleThree]} | ${true}
            ${"with not required IAR and not received valid IAR status without documents"} | ${{ isIarRequired: false, iarStatus: "Not Received" }} | ${[]}                  | ${true}
            ${"with required IAR and valid IAR status with documents"}                     | ${{ isIarRequired: true, iarStatus: "Received" }}      | ${[stubScheduleThree]} | ${true}
            ${"with required IAR and valid IAR status without documents"}                  | ${{ isIarRequired: true, iarStatus: "Received" }}      | ${[]}                  | ${true}
            ${"with required IAR and invalid IAR status with documents"}                   | ${{ isIarRequired: true, iarStatus: "Not Received" }}  | ${[stubScheduleThree]} | ${true}
            ${"with required IAR and invalid IAR status without documents"}                | ${{ isIarRequired: true, iarStatus: "Not Received" }}  | ${[]}                  | ${false}
          `("$name as KTP competition", ({ stubClaim, stubDocuments, expectedToBeValid }) => {
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
              ProjectRolePermissionBits.FinancialContact,
            );

            expect(claimState.isValid).toBe(expectedToBeValid);
            expect(claimState.errorMessage).toMatchSnapshot();
          });
        });

        describe("when claim not a final claim", () => {
          const ktpCompetitionType = "KTP";

          test.each`
            name                                                                                       | stubClaim                                                         | stubDocuments          | testCompetitionType    | expectedToBeValid
            ${"with required IAR and valid IAR status with documents as non-KTP competition"}          | ${{ isIarRequired: true, iarStatus: ReceivedStatus.Received }}    | ${[stubIar]}           | ${stubCompetitionType} | ${true}
            ${"with required IAR and valid IAR status without documents as non-KTP competition"}       | ${{ isIarRequired: true, iarStatus: ReceivedStatus.Received }}    | ${[]}                  | ${stubCompetitionType} | ${true}
            ${"with required IAR and invalid IAR status with documents as non-KTP competition"}        | ${{ isIarRequired: true, iarStatus: ReceivedStatus.NotReceived }} | ${[stubIar]}           | ${stubCompetitionType} | ${true}
            ${"with required IAR and invalid IAR status without documents as non-KTP competition"}     | ${{ isIarRequired: true, iarStatus: ReceivedStatus.NotReceived }} | ${[]}                  | ${stubCompetitionType} | ${false}
            ${"with non required IAR and a valid IAR status without documents as non-KTP competition"} | ${{ isIarRequired: false, iarStatus: ReceivedStatus.Received }}   | ${[]}                  | ${stubCompetitionType} | ${true}
            ${"with non required IAR and a valid IAR status with documents as non-KTP competition"}    | ${{ isIarRequired: false, iarStatus: ReceivedStatus.Received }}   | ${[stubIar]}           | ${stubCompetitionType} | ${true}
            ${"with required IAR and valid IAR status with documents as KTP competition"}              | ${{ isIarRequired: true, iarStatus: ReceivedStatus.Received }}    | ${[stubScheduleThree]} | ${ktpCompetitionType}  | ${true}
            ${"with required IAR and valid IAR status without documents as KTP competition"}           | ${{ isIarRequired: true, iarStatus: ReceivedStatus.Received }}    | ${[]}                  | ${ktpCompetitionType}  | ${true}
            ${"with required IAR and invalid IAR status with documents as KTP competition"}            | ${{ isIarRequired: true, iarStatus: ReceivedStatus.NotReceived }} | ${[stubScheduleThree]} | ${ktpCompetitionType}  | ${true}
            ${"with required IAR and invalid IAR status without documents as KTP competition"}         | ${{ isIarRequired: true, iarStatus: ReceivedStatus.NotReceived }} | ${[]}                  | ${ktpCompetitionType}  | ${false}
          `("$name", ({ stubClaim, stubDocuments, testCompetitionType, expectedToBeValid }) => {
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
              ProjectRolePermissionBits.FinancialContact,
            );

            expect(claimState.isValid).toBe(expectedToBeValid);
            expect(claimState.errorMessage).toMatchSnapshot();
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
              name                                                                  | testClaimDto                                                                      | expectedState
              ${"with required IAR with IAR status is valid and not PCF"}           | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Not Received" }}      | ${false}
              ${"with required IAR with PCF status is valid and not iar"}           | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Received" }}      | ${false}
              ${"with required IAR with IAR and PCF statuses are invalid"}          | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Not Received" }}  | ${false}
              ${"with required IAR with IAR and PCF statuses are valid"}            | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Received" }}          | ${true}
              ${"with non required IAR with IAR and PCF statuses are not received"} | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${false}
              ${"with non required IAR with PCF received but not IAR"}              | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Received" }}     | ${true}
              ${"with non required IAR with IAR and PCF received"}                  | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Received" }}         | ${true}
              ${"with non required IAR with IAR received but not PCF"}              | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Not Received" }}     | ${false}
            `("$name", ({ testClaimDto, expectedState }) => {
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
                ProjectRolePermissionBits.FinancialContact,
              );

              expect(claimState.isValid).toBe(expectedState);
              expect(claimState.errorMessage).toMatchSnapshot();
            });
          });

          describe("when KTP", () => {
            const ktpCompetitionType = "KTP";

            test.each`
              name                                                             | testClaimDto                                                                      | expectedState
              ${"with IAR required when iar status is valid and not pcf"}      | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Not Received" }}      | ${true}
              ${"with IAR required when iar and pcf statuses are valid"}       | ${{ isIarRequired: true, iarStatus: "Received", pcfStatus: "Received" }}          | ${true}
              ${"with IAR required when iar and pcf statuses are invalid"}     | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Not Received" }}  | ${false}
              ${"with IAR required when pcf status is valid and not iar"}      | ${{ isIarRequired: true, iarStatus: "Not Received", pcfStatus: "Received" }}      | ${false}
              ${"with IAR not required when iar status is valid and not pcf"}  | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Not Received" }}     | ${true}
              ${"with IAR not required when iar and pcf statuses are valid"}   | ${{ isIarRequired: false, iarStatus: "Received", pcfStatus: "Received" }}         | ${true}
              ${"with IAR not required when iar and pcf statuses are invalid"} | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Not Received" }} | ${true}
              ${"with IAR not required when pcf status is valid and not iar"}  | ${{ isIarRequired: false, iarStatus: "Not Received", pcfStatus: "Received" }}     | ${true}
            `("$name", ({ testClaimDto, expectedState }) => {
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
                ProjectRolePermissionBits.FinancialContact,
              );

              expect(claimState.isValid).toBe(expectedState);
              expect(claimState.errorMessage).toMatchSnapshot();
            });
          });

          describe("when ktp project competition", () => {
            test.each`
              name              | testClaimDto                     | expectedState
              ${"when valid"}   | ${{ iarStatus: "Received" }}     | ${true}
              ${"when invalid"} | ${{ iarStatus: "Not Received" }} | ${false}
            `("when iar required and status $name", ({ testClaimDto, expectedState }) => {
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
                ProjectRolePermissionBits.FinancialContact,
              );

              expect(claimState.isValid).toBe(expectedState);
              expect(claimState.errorMessage).toMatchSnapshot();
            });
          });
        });

        describe("when not the final claim", () => {
          const ktpCompetitionType = "KTP";

          test.each`
            name                                                                     | testClaimDto                     | testCompetitionType    | expectedState
            ${"when IAR required with IAR status is valid"}                          | ${{ iarStatus: "Received" }}     | ${stubCompetitionType} | ${true}
            ${"when IAR required with IAR statuses is invalid when not KTP project"} | ${{ iarStatus: "Not Received" }} | ${stubCompetitionType} | ${false}
            ${"when IAR required with IAR statuses is invalid when a KTP project"}   | ${{ iarStatus: "Not Received" }} | ${ktpCompetitionType}  | ${false}
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
              ProjectRolePermissionBits.FinancialContact,
            );

            expect(claimState.isValid).toBe(expectedState);
            expect(claimState.errorMessage).toMatchSnapshot();
          });
        });
      });
    });

    describe("with comments", () => {
      describe("with correct claim status", () => {
        test.each`
          name                                                                    | testClaimDto                                                            | testOriginalStatus        | errorMessage
          ${"with correct status and original status"}                            | ${{ status: ClaimStatus.MO_QUERIED, comments: "must-contain-a-value" }} | ${ClaimStatus.DRAFT}      | ${null}
          ${"with an incorrect status and valid original status but no comments"} | ${{ status: ClaimStatus.DRAFT, comments: "must-contain-a-value" }}      | ${ClaimStatus.DRAFT}      | ${null}
          ${"with correct status and original status but no comments"}            | ${{ status: ClaimStatus.MO_QUERIED, comments: "" }}                     | ${ClaimStatus.DRAFT}      | ${"Comments are required if querying a claim"}
          ${"with correct status and original status but no comments"}            | ${{ status: ClaimStatus.MO_QUERIED, comments: "must-contain-a-value" }} | ${ClaimStatus.MO_QUERIED} | ${null}
        `("$name", ({ testClaimDto, testOriginalStatus, errorMessage }) => {
          const stubCommentsClaim = { ...stubClaimDto, ...testClaimDto } as ClaimDto;

          const { comments } = new ClaimDtoValidator(
            stubCommentsClaim,
            testOriginalStatus,
            [],
            [],
            stubShowErrors,
            stubCompetitionType,
            ProjectRolePermissionBits.FinancialContact,
          );

          expect(comments.isValid).toBe(errorMessage === null);
          expect(comments.errorMessage).toMatchSnapshot();
        });
      });

      describe("with correct length validation", () => {
        test.each`
          name                                      | testCommentValue    | errorMessage
          ${"with max comment length of 1000"}      | ${"_".repeat(1000)} | ${null}
          ${"with an exceeding max comment length"} | ${"_".repeat(1001)} | ${"Comments must be a maximum of 1000 characters"}
        `("$name", ({ testCommentValue, errorMessage }) => {
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
            ProjectRolePermissionBits.FinancialContact,
          );

          expect(comments.isValid).toBe(errorMessage === null);
          expect(comments.errorMessage).toMatchSnapshot();
        });
      });
    });

    describe("with totalCosts", () => {
      test.each`
        name                                                     | testClaimDetails                                              | errorMessage
        ${"when total costs are valid"}                          | ${[{ remainingOfferCosts: 1 }]}                               | ${null}
        ${"when all total costs accumulate to a positive total"} | ${[{ remainingOfferCosts: 5 }, { remainingOfferCosts: 5 }]}   | ${null}
        ${"when total costs are zero"}                           | ${[{ remainingOfferCosts: 0 }]}                               | ${null}
        ${"when total costs are negative"}                       | ${[{ remainingOfferCosts: -1 }]}                              | ${"You must reduce your claim to ensure the remaining eligible costs are zero or higher."}
        ${"when all total costs accumulate to a negative total"} | ${[{ remainingOfferCosts: 5 }, { remainingOfferCosts: -10 }]} | ${"You must reduce your claim to ensure the remaining eligible costs are zero or higher."}
      `("$name", ({ testClaimDetails, errorMessage }) => {
        const { totalCosts } = new ClaimDtoValidator(
          stubClaimDto,
          stubOriginalStatus,
          testClaimDetails,
          [],
          stubShowErrors,
          stubCompetitionType,
          ProjectRolePermissionBits.FinancialContact,
        );

        const expectedToBeValid = errorMessage === null;

        expect(totalCosts.isValid).toBe(expectedToBeValid);

        if (!expectedToBeValid) {
          // TODO: Remove conditional expects
          // eslint-disable-next-line jest/no-conditional-expect
          expect(totalCosts.errorMessage).toMatchSnapshot();
        }
      });
    });
  });
});
