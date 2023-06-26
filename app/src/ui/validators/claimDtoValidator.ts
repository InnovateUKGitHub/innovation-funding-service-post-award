import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import * as Validation from "@ui/validators/common";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ReceivedStatus } from "@framework/entities/received-status";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";

export const claimCommentsMaxLength = 1000;

export class ClaimDtoValidator extends Results<ClaimDto> {
  constructor(
    dto: ClaimDto,
    private readonly originalStatus: ClaimStatus,
    private readonly details: CostsSummaryForPeriodDto[],
    private readonly documents: DocumentSummaryDto[],
    public readonly showErrors: boolean,
    private readonly competitionType: PartnerDto["competitionType"],
    private readonly isClaimSummary?: boolean,
  ) {
    super({ model: dto, showValidationErrors: showErrors, competitionType });
  }

  static permittedStatuses: Readonly<ClaimStatus[]> = [
    ClaimStatus.DRAFT,
    ClaimStatus.AWAITING_IAR,
    ClaimStatus.SUBMITTED,
    ClaimStatus.MO_QUERIED,
    ClaimStatus.AWAITING_IUK_APPROVAL,
    ClaimStatus.INNOVATE_QUERIED,
  ];

  private readonly isKtpCompetition: boolean = checkProjectCompetition(this.competitionType).isKTP;
  private readonly hasDocuments: boolean = !!this.documents.length;
  private readonly isPcfStatusValid = this.model.pcfStatus === ReceivedStatus.Received;
  private readonly shouldValidatePcf =
    (!this.isKtpCompetition && this.model.isFinalClaim) ||
    (this.model.impactManagementParticipation === ImpactManagementParticipation.Yes && this.model.isFinalClaim);

  private readonly isReceivedIarStatus: boolean = this.model.iarStatus === ReceivedStatus.Received;
  private readonly isIarStatusWithDocsValid: boolean = this.hasDocuments && this.isReceivedIarStatus;

  public status = this.validateStatus();
  public id = this.validateId();
  public claimState = this.getClaimValidation();
  public totalCosts = this.validateTotalCosts();
  public comments = this.validateComments();

  private validateStatus(): Result {
    const isValidStatus = this.model.status.length
      ? ClaimDtoValidator.permittedStatuses.includes(this.model.status)
      : false;

    return Validation.isTrue(
      this,
      isValidStatus,
      this.getContent(x => x.validation.claimDtoValidator.statusInvalid({ status: this.model.status })),
    );
  }

  private validateId(): Result {
    return Validation.required(this, this.model.id, "Id is required");
  }

  private validateComments(): Result {
    const isNotOriginallyMoQueried = this.originalStatus !== ClaimStatus.MO_QUERIED;
    const isCurrentlyMoQueried = this.model.status === ClaimStatus.MO_QUERIED;

    const shouldValidateComments = isCurrentlyMoQueried && isNotOriginallyMoQueried;

    return Validation.all(
      this,
      () =>
        shouldValidateComments
          ? Validation.required(
              this,
              this.model.comments,
              this.getContent(x => x.validation.claimDtoValidator.queryingCommentRequired),
              "comments",
            )
          : Validation.valid(this),
      () =>
        Validation.maxLength(
          this,
          this.model.comments,
          claimCommentsMaxLength,
          this.getContent(x => x.validation.claimDtoValidator.queryingCommentLength({ count: claimCommentsMaxLength })),
          "comments",
        ),
    );
  }

  private validateTotalCosts(): Result {
    const remainingOfferCosts = this.details.reduce((total, item) => total + item.remainingOfferCosts, 0);

    return Validation.isPositiveFloat(
      this,
      remainingOfferCosts,
      this.getContent(x => x.validation.claimDtoValidator.totalCostsPositive),
    );
  }

  private validateIarStatus(): Result {
    const notIarRequired = !this.model.isIarRequired;
    const ktpAndNotIarRequired = this.isKtpCompetition && notIarRequired;

    // Note: ignore validation when is not required
    if (notIarRequired || ktpAndNotIarRequired) return Validation.valid(this);

    return Validation.isTrue(
      this,
      this.isIarStatusWithDocsValid,
      this.getContent(x => x.validation.claimDtoValidator.iarStatusInvalid),
    );
  }

  private validatePcfStatus(): Result {
    // Note: For the time being ignore all ktp validation here
    if (this.isKtpCompetition) return Validation.valid(this);

    // Allow not having a PCF if we are in draft, queried by MO, or queried by Innovate UK
    if (
      this.model.status === ClaimStatus.DRAFT ||
      this.model.status === ClaimStatus.MO_QUERIED ||
      this.model.status === ClaimStatus.INNOVATE_QUERIED
    ) {
      return Validation.valid(this);
    }

    return Validation.isTrue(
      this,
      this.isPcfStatusValid,
      this.getContent(x => x.validation.claimDtoValidator.pcfStatusInvalid),
    );
  }

  private getClaimValidation(): Result {
    // Note: We only validate the claim state on the summary page
    if (!this.isClaimSummary) return Validation.valid(this);

    const hasOriginalAwaitingIarClaim: boolean = this.originalStatus === ClaimStatus.AWAITING_IAR;

    return hasOriginalAwaitingIarClaim ? this.validateAwaitingIarClaim() : this.validateDefaultClaim();
  }

  private validateAwaitingIarClaim(): Result {
    const hasInvalidStatuses = !this.isIarStatusWithDocsValid && !this.isPcfStatusValid;

    // Note: Auto-fail and combine both (pcf + iar) errors in one when not valid
    if (this.shouldValidatePcf && this.model.isIarRequired && hasInvalidStatuses) {
      return Validation.inValid(
        this,
        this.getContent(x => x.validation.claimDtoValidator.iarPcfStatusInvalid),
      );
    }

    return Validation.all(
      this,
      () => this.validateIarStatus(),
      () => (this.shouldValidatePcf ? this.validatePcfStatus() : Validation.valid(this)),
    );
  }

  private validateDefaultClaim(): Result {
    // Note: KTP will only every require IAR validation not PCF
    return this.shouldValidatePcf ? this.validatePcfStatus() : this.validateIarStatus();
  }
}
