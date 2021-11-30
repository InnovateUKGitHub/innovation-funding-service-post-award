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
    super(dto, showErrors);
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
      return Validation.inValid(this, "Your loan has already been submitted. You cannot resubmit this again.");
    }

    return Validation.isTrue(
      this,
      status === LoanStatus.PLANNED,
      "Your loan must have a valid status to start a drawdown request.",
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
      `All supporting loan documents must contain the description '${DocumentDescription.Loan}'.`,
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
      "The request is only accepted when at least 1 document has been uploaded.",
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
      "Please contact support, your drawdown amount must match your drawdown forecast.",
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
      `You must enter at least ${minCharLimit} characters as a comment.`,
    );
  }
}
