import { ClaimStatus } from "@framework/constants";
import { ClaimDto, CostsSummaryForPeriodDto, DocumentSummaryDto } from "@framework/dtos";
import { ClaimDtoValidator } from "@ui/validators";

describe("claimDtoValidator()", () => {
  const stubClaimDto = { id: "stub-id" } as ClaimDto;
  const stubOriginalStatus = ClaimStatus.DRAFT;
  const stubDocument = { fileName: "stub-fileName" } as DocumentSummaryDto;
  const stubShowErrors = true;
  const stubCompetitionType = "CR&D";
  const stubIsFinalSummary = true;

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

  describe("with isFinalClaim", () => {
    describe("should bail from validation", () => {
      test("when not a final claim", () => {
        const notFinalClaim = false;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubClaimDto,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          notFinalClaim,
        );

        expect(isFinalClaim.isValid).toBeTruthy();
      });

      test("when competition is KTP", () => {
        const isKtpCompetition = "KTP";
        const validFinalClaim = true;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubClaimDto,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          isKtpCompetition,
          validFinalClaim,
        );

        expect(isFinalClaim.isValid).toBeTruthy();
      });
    });

    describe("when claim is a final claim", () => {
      test("when pcf status is valid", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: true, pcfStatus: "Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeTruthy();
      });

      test("when pcf status is invalid", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: true, pcfStatus: "Not Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeFalsy();
        expect(isFinalClaim.errorMessage).toBe(
          "You must upload a project completion form before you can submit this claim.",
        );
      });
    });

    describe("when claim not a final claim", () => {
      test("when pcf status is valid with documents", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: false, iarStatus: "Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [stubDocument],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeTruthy();
      });

      test("when pcf status is valid without documents", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: false, iarStatus: "Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeFalsy();
        expect(isFinalClaim.errorMessage).toBe(
          "You must upload an independent accountant's report before you can submit this claim.",
        );
      });

      test("when pcf status is invalid with documents", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: false, iarStatus: "Not Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [stubDocument],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeFalsy();
        expect(isFinalClaim.errorMessage).toBe(
          "You must upload an independent accountant's report before you can submit this claim.",
        );
      });

      test("when pcf status is valid without documents", () => {
        const stubFinalClaim = { ...stubClaimDto, isFinalClaim: false, iarStatus: "Not Received" } as ClaimDto;

        const { isFinalClaim } = new ClaimDtoValidator(
          stubFinalClaim,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(isFinalClaim.isValid).toBeFalsy();
        expect(isFinalClaim.errorMessage).toBe(
          "You must upload an independent accountant's report before you can submit this claim.",
        );
      });
    });
  });

  describe("with iar", () => {
    describe("should bail from validation", () => {
      test("when not a final claim summary", () => {
        const { iar } = new ClaimDtoValidator(
          stubClaimDto,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          false,
        );

        expect(iar.isValid).toBeTruthy();
      });

      test("when not a KTP competition", () => {
        const notKtpCompetition = "CR&D";

        const { iar } = new ClaimDtoValidator(
          stubClaimDto,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          notKtpCompetition,
          true,
        );

        expect(iar.isValid).toBeTruthy();
      });

      test("when not iar required", () => {
        const iarNotRequired = { ...stubClaimDto, isIarRequired: false };

        const { iar } = new ClaimDtoValidator(
          iarNotRequired,
          stubOriginalStatus,
          [],
          [stubDocument],
          stubShowErrors,
          stubCompetitionType,
          true,
        );

        expect(iar.isValid).toBeTruthy();
      });
    });

    describe("with correct validation", () => {
      const isKtpCompetition = "KTP";

      test("with valid iar claim with documents", () => {
        const iarRequiredWithReceivedStatus = {
          ...stubClaimDto,
          isIarRequired: true,
          iarStatus: "Received",
        } as ClaimDto;

        const { iar } = new ClaimDtoValidator(
          iarRequiredWithReceivedStatus,
          stubOriginalStatus,
          [],
          [stubDocument],
          stubShowErrors,
          isKtpCompetition,
          stubIsFinalSummary,
        );

        expect(iar.isValid).toBeTruthy();
      });

      test("with valid iar claim without documents", () => {
        const iarRequiredWithReceivedStatus = {
          ...stubClaimDto,
          isIarRequired: true,
          iarStatus: "Received",
        } as ClaimDto;

        const { iar } = new ClaimDtoValidator(
          iarRequiredWithReceivedStatus,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          isKtpCompetition,
          stubIsFinalSummary,
        );

        expect(iar.isValid).toBeFalsy();
        expect(iar.errorMessage).toBe("You must upload a schedule 3 before you can submit this claim.");
      });

      test("with invalid iar claim with documents", () => {
        const iarRequiredWithoutReceivedStatus = {
          ...stubClaimDto,
          isIarRequired: true,
          iarStatus: "Not Received",
        } as ClaimDto;

        const { iar } = new ClaimDtoValidator(
          iarRequiredWithoutReceivedStatus,
          stubOriginalStatus,
          [],
          [stubDocument],
          stubShowErrors,
          isKtpCompetition,
          stubIsFinalSummary,
        );

        expect(iar.isValid).toBeFalsy();
        expect(iar.errorMessage).toBe("You must upload a schedule 3 before you can submit this claim.");
      });

      test("with invalid iar claim without documents", () => {
        const iarRequiredWithoutReceivedStatus = {
          ...stubClaimDto,
          isIarRequired: true,
          iarStatus: "Not Received",
        } as ClaimDto;

        const { iar } = new ClaimDtoValidator(
          iarRequiredWithoutReceivedStatus,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          isKtpCompetition,
          stubIsFinalSummary,
        );

        expect(iar.isValid).toBeFalsy();
        expect(iar.errorMessage).toBe("You must upload a schedule 3 before you can submit this claim.");
      });
    });
  });

  describe("with comments", () => {
    describe("with correct claim status", () => {
      test("with correct status and original status", () => {
        const validClaimStatus = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: "must-contain-a-value",
        } as ClaimDto;
        const draftOriginalStatus = ClaimStatus.DRAFT;

        const { comments } = new ClaimDtoValidator(
          validClaimStatus,
          draftOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeTruthy();
      });

      test("with an incorrect status and valid original status but no comments", () => {
        const invalidCommentClaim = {
          ...stubClaimDto,
          status: ClaimStatus.DRAFT,
          comments: "must-contain-a-value",
        } as ClaimDto;
        const draftOriginalStatus = ClaimStatus.DRAFT;

        const { comments } = new ClaimDtoValidator(
          invalidCommentClaim,
          draftOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeTruthy();
      });

      test("with correct status and original status but no comments", () => {
        const invalidCommentClaim = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: "",
        } as ClaimDto;
        const draftOriginalStatus = ClaimStatus.DRAFT;

        const { comments } = new ClaimDtoValidator(
          invalidCommentClaim,
          draftOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeFalsy();
        expect(comments.errorMessage).toBe("Comments are required if querying a claim");
      });

      test("with correct status but not original status", () => {
        const validClaimStatus = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: "must-contain-a-value",
        } as ClaimDto;
        const draftOriginalStatus = ClaimStatus.MO_QUERIED;

        const { comments } = new ClaimDtoValidator(
          validClaimStatus,
          draftOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeTruthy();
      });
    });

    describe("with correct length validation", () => {
      test("with max comment length of 1000", () => {
        const stub1000Chars = "_".repeat(1000);

        const validClaimStatus = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: stub1000Chars,
        } as ClaimDto;

        const { comments } = new ClaimDtoValidator(
          validClaimStatus,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeTruthy();
      });

      test("with an exceeding max comment length", () => {
        const stub1001Chars = "_".repeat(1001);

        const validClaimStatus = {
          ...stubClaimDto,
          status: ClaimStatus.MO_QUERIED,
          comments: stub1001Chars,
        } as ClaimDto;

        const { comments } = new ClaimDtoValidator(
          validClaimStatus,
          stubOriginalStatus,
          [],
          [],
          stubShowErrors,
          stubCompetitionType,
          stubIsFinalSummary,
        );

        expect(comments.isValid).toBeFalsy();
        expect(comments.errorMessage).toBe("Comments must be a maximum of 1000 characters");
      });
    });
  });

  describe("with totalCosts", () => {
    test("when total costs are valid", () => {
      const stubDefinedRemainingOfferDetail = { remainingOfferCosts: 1 } as CostsSummaryForPeriodDto;

      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [stubDefinedRemainingOfferDetail],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBeTruthy();
    });

    test("when all total costs accumulate to a positive total", () => {
      const stubPositiveRemainingOfferDetail = { remainingOfferCosts: 5 } as CostsSummaryForPeriodDto;

      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [stubPositiveRemainingOfferDetail, stubPositiveRemainingOfferDetail],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBeTruthy();
    });

    test("when total costs are zero", () => {
      const stubEmptyRemainingOfferDetail = { remainingOfferCosts: 0 } as CostsSummaryForPeriodDto;

      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [stubEmptyRemainingOfferDetail],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBeTruthy();
    });

    test("when total costs are negative", () => {
      const stubEmptyRemainingOfferDetail = { remainingOfferCosts: -1 } as CostsSummaryForPeriodDto;

      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [stubEmptyRemainingOfferDetail],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBeFalsy();
      expect(totalCosts.errorMessage).toBe(
        "You must reduce your claim to ensure the remaining eligible costs are zero or higher.",
      );
    });

    test("when all total costs accumulate to a negative total", () => {
      const stubPositiveRemainingOfferDetail = { remainingOfferCosts: 5 } as CostsSummaryForPeriodDto;
      const stubNegativeRemainingOfferDetail = { remainingOfferCosts: -10 } as CostsSummaryForPeriodDto;

      const { totalCosts } = new ClaimDtoValidator(
        stubClaimDto,
        stubOriginalStatus,
        [stubPositiveRemainingOfferDetail, stubNegativeRemainingOfferDetail],
        [],
        stubShowErrors,
        stubCompetitionType,
      );

      expect(totalCosts.isValid).toBeFalsy();
      expect(totalCosts.errorMessage).toBe(
        "You must reduce your claim to ensure the remaining eligible costs are zero or higher.",
      );
    });
  });
});
