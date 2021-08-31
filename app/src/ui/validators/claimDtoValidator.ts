import { ClaimDto, ClaimStatus, CostsSummaryForPeriodDto, PartnerDto } from "@framework/types";
import { DocumentSummaryDto } from "@framework/dtos";

import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

import { Results, Result } from "@ui/validation";
import * as Validation from "@ui/validators/common";

const commentsLengthMax = 1000;

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
    super(dto, showErrors);
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
  private readonly isPcfStatusValid = this.model.pcfStatus === "Received";

  private readonly isReceivedIarStatus: boolean = this.model.iarStatus === "Received";
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
      `The claim status '${this.model.status || "Unknown"}' is not permitted to continue.`,
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
          ? Validation.required(this, this.model.comments, "Comments are required if querying a claim")
          : Validation.valid(this),
      () =>
        Validation.maxLength(
          this,
          this.model.comments,
          commentsLengthMax,
          `Comments must be a maximum of ${commentsLengthMax} characters`,
        ),
    );
  }

  private validateTotalCosts(): Result {
    const remainingOfferCosts = this.details.reduce((total, item) => total + item.remainingOfferCosts, 0);

    return Validation.isPositiveFloat(
      this,
      remainingOfferCosts,
      "You must reduce your claim to ensure the remaining eligible costs are zero or higher.",
    );
  }

  private validateIarStatus(): Result {
    // Note: ignore validation when is not required
    if (!this.model.isIarRequired) return Validation.valid(this);

    const iarStatusError: string = this.isKtpCompetition
      ? "You must upload a schedule 3 before you can submit this claim."
      : "You must upload an independent accountant's report before you can submit this claim.";

    return Validation.isTrue(this, this.isIarStatusWithDocsValid, iarStatusError);
  }

  private validatePcfStatus(): Result {
    return Validation.isTrue(
      this,
      this.isPcfStatusValid,
      "You must upload a project completion form before you can submit this claim.",
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
    if (this.model.isFinalClaim && hasInvalidStatuses) {
      return Validation.inValid(
        this,
        "You must upload an independent accountant's report and a project completion form before you can submit this claim.",
      );
    }

    return Validation.all(
      this,
      () => this.validateIarStatus(),
      () => (this.model.isFinalClaim ? this.validatePcfStatus() : Validation.valid(this)),
    );
  }

  private validateDefaultClaim(): Result {
    return this.model.isFinalClaim ? this.validatePcfStatus() : this.validateIarStatus();
  }
}
