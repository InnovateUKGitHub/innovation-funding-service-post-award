import { DocumentDescription } from "@framework/constants";
import { DocumentSummaryDto, LoanDto } from "@framework/dtos";
import { LoanStatus } from "@framework/entities";

import { Result, Results } from "@ui/validation";
import * as Validation from "@ui/validators/common";

export class LoanDtoValidator extends Results<LoanDto> {
  constructor(
    private readonly dto: LoanDto,
    private readonly loanDocuments: DocumentSummaryDto[],
    public readonly showErrors: boolean,
  ) {
    super({ model: dto, showValidationErrors: showErrors });
  }

  public status = this.validateStatus();
  public documents = this.validateDocuments();
  public comments = this.validateComments();
  public matchingAmountToForecast = this.validateAmount();
  public documentDescription = this.validateDocumentDescription();

  /**
   * @description Checks the type is correctly added for later filtering
   */
  private validateStatus(): Result {
    const { status } = this.dto;

    if (status === LoanStatus.REQUESTED) {
      return Validation.inValid(
        this,
        this.getContent(x => x.validation.loanDtoValidator.statusInvalidSubmitted),
      );
    }

    return Validation.isTrue(
      this,
      status === LoanStatus.PLANNED,
      this.getContent(x => x.validation.loanDtoValidator.statusInvalid),
    );
  }

  /**
   * @description Checks the type is correctly added for later filtering
   */
  private validateDocumentDescription(): Result {
    const hasValidDescription = this.loanDocuments.every(x => x.description === DocumentDescription.Loan);

    return Validation.isTrue(
      this,
      hasValidDescription,
      this.getContent(x => x.validation.loanDtoValidator.documentsInvalidDescription),
    );
  }

  /**
   * @description Every loan submission requires a document as part of the proof
   */
  private validateDocuments(): Result {
    const hasDocuments = this.loanDocuments.length > 0;

    return Validation.isTrue(
      this,
      hasDocuments,
      this.getContent(x => x.validation.loanDtoValidator.documentCountTooSmall),
    );
  }

  /**
   * @description Capture DB issues sooner... A loan should always match the original forecast as part of reconciliation on the DB layer
   */
  private validateAmount(): Result {
    const { forecastAmount, amount } = this.dto;

    return Validation.isTrue(
      this,
      forecastAmount === amount,
      this.getContent(x => x.validation.loanDtoValidator.forecastAmountDoesNotMatchAmount),
    );
  }

  private validateComments(): Result {
    const parsedComments = this.dto.comments.trim();

    // Note: We allow no comments
    if (parsedComments.length === 0) return Validation.valid(this);

    const minCharLimit = 5;

    return Validation.minLength(
      this,
      parsedComments,
      minCharLimit,
      this.getContent(x => x.validation.loanDtoValidator.commentLengthTooSmall({ count: minCharLimit })),
    );
  }
}
