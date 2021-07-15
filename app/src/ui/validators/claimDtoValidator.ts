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

    const permittedStatus = [
      ClaimStatus.DRAFT,
      ClaimStatus.SUBMITTED,
      ClaimStatus.MO_QUERIED,
      ClaimStatus.AWAITING_IUK_APPROVAL,
      ClaimStatus.INNOVATE_QUERIED,
    ];

    this.status = Validation.isTrue(
      this,
      !this.model.status || permittedStatus.includes(this.model.status),
      "Set a valid status",
    );
  }

  public status: Result;

  // private readonly iarRequiredStatus = new Map<ClaimStatus, ClaimStatus[]>([
  //   [ClaimStatus.DRAFT, [ClaimStatus.SUBMITTED]],
  //   [ClaimStatus.MO_QUERIED, [ClaimStatus.SUBMITTED]],
  //   [ClaimStatus.INNOVATE_QUERIED, [ClaimStatus.AWAITING_IUK_APPROVAL]],
  // ]);

  public id = this.validateId();
  public isFinalClaim = this.validateFinalClaim();
  public totalCosts = this.validateTotalCosts();
  public comments = this.validateComments();
  // public iar = this.validateIar();

  private validateId() {
    return Validation.required(this, this.model.id, "Id is required");
  }

  private validateComments() {
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
  private validateTotalCosts() {
    const remainingOfferCosts = this.details.reduce((total, item) => total + item.remainingOfferCosts, 0);

    return Validation.isPositiveFloat(
      this,
      remainingOfferCosts,
      "You must reduce your claim to ensure the remaining eligible costs are zero or higher.",
    );
  }

  // TODO: Reinstate with additional logic in later ticket
  // private validateIar() {
  //   const iarRequiredStatus = this.iarRequiredStatus.get(this.originalStatus);
  //   const isIarRequired = this.model.isIarRequired && iarRequiredStatus?.includes(this.model.status);

  //   return Validation.isTrue(
  //     this,
  //     !isIarRequired || this.documents.length > 0,
  //     "You must upload a supporting document before you can submit this claim.",
  //   );
  // }

  private validateFinalClaim() {
    if (!this.isClaimSummary) return Validation.valid(this);

    const { isKTP } = checkProjectCompetition(this.competitionType);
    const isNotFinalClaim = !this.model.isFinalClaim;

    if (isNotFinalClaim || isKTP) return Validation.valid(this);

    const isValid = this.model.pcfStatus === "Received";

    return Validation.isTrue(
      this,
      isValid,
      "You must upload a project completion form before you can submit this claim.",
    );
  }
}
