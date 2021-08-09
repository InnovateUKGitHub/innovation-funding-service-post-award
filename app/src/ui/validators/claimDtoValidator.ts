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
  private readonly hasValidIarStatusWithDocs = !!this.documents.length && this.model.iarStatus === "Received";

  public status = this.validateStatus();
  public id = this.validateId();
  public isFinalClaim = this.validateFinalClaim();
  public totalCosts = this.validateTotalCosts();
  public comments = this.validateComments();
  public iar = this.validateIarStatus();

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
    return Validation.all(
      this,
      () =>
        this.model.status === ClaimStatus.MO_QUERIED && this.originalStatus !== ClaimStatus.MO_QUERIED
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
    // Note: Bail from validation if your not KTP as iar validation is only associated with KTP projects
    if (!this.isClaimSummary || !this.isKtpCompetition || !this.model.isIarRequired) {
      return Validation.valid(this);
    }

    return Validation.isTrue(
      this,
      this.hasValidIarStatusWithDocs,
      "You must upload a schedule 3 before you can submit this claim.",
    );
  }

  private validateFinalClaim(): Result {
    // Note: Disallow KTP from these checks as they validate from validateIarStatus()
    if (!this.isClaimSummary || this.isKtpCompetition) {
      return Validation.valid(this);
    }

    if (this.model.isFinalClaim) {
      const isPcfStatusValid = this.model.pcfStatus === "Received";

      return Validation.isTrue(
        this,
        isPcfStatusValid,
        "You must upload a project completion form before you can submit this claim.",
      );
    } else {
      return Validation.isTrue(
        this,
        this.hasValidIarStatusWithDocs,
        "You must upload an independent accountant's report before you can submit this claim.",
      );
    }
  }
}
