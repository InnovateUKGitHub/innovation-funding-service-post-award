import { ClaimStatus } from "@framework/constants/claimStatus";
import { ClaimDto } from "@framework/dtos/claimDto";
import { CostsSummaryForPeriodDto } from "@framework/dtos/costsSummaryForPeriodDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import * as Validation from "@ui/validation/validators/common";
import { ClaimPcfIarSharedValidatorResult, iarValidation, pcfValidation } from "./shared/claimPcfIarSharedValidator";

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

  public status = this.validateStatus();
  public id = this.validateId();
  public claimState = this.getPcfIarValidation();
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

  /**
   * Run both PCF and IAR (KTP: Schedule 3) validation
   *
   * YOU MUST update the Confluence document before editing the code.
   * @see {@link https://ukri.atlassian.net/wiki/spaces/ACC/pages/467107882/PCF+IAR+Validation}
   */
  private getPcfIarValidation(): Result {
    return Validation.all(
      this,
      () => this.getPcfValidation(),
      () => this.getIarValidation(),
    );
  }

  private getPcfValidation(): Result {
    switch (
      pcfValidation({
        claim: this.model,
        documents: this.documents,
        project: { competitionType: this.competitionType },
      })
    ) {
      case ClaimPcfIarSharedValidatorResult.PCF_MISSING:
        return Validation.inValid(
          this,
          this.getContent(x => x.forms.claimSummary.documents.errors.pcf_required),
        );
      case ClaimPcfIarSharedValidatorResult.IM_QUESTIONS_MISSING:
        return Validation.inValid(
          this,
          this.getContent(x => x.forms.claimSummary.documents.errors.im_required),
        );
      default:
        return Validation.valid(this);
    }
  }

  private getIarValidation(): Result {
    switch (
      iarValidation({
        claim: this.model,
        documents: this.documents,
        project: { competitionType: this.competitionType },
      })
    ) {
      case ClaimPcfIarSharedValidatorResult.IAR_MISSING:
        return Validation.inValid(
          this,
          this.getContent(x => x.forms.claimSummary.documents.errors.iar_required),
        );
      case ClaimPcfIarSharedValidatorResult.SCHEDULE_THREE_MISSING:
        return Validation.inValid(
          this,
          this.getContent(x => x.forms.claimSummary.documents.errors.schedule3_required),
        );
      default:
        return Validation.valid(this);
    }
  }
}
