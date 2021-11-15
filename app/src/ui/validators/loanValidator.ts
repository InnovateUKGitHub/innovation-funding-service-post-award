import { DocumentSummaryDto, LoanDtoWithTotals } from "@framework/dtos";

import { Result, Results } from "@ui/validation";
import * as Validation from "@ui/validators/common";

export class LoanDtoValidator extends Results<LoanDtoWithTotals> {
  constructor(
    private readonly dto: LoanDtoWithTotals,
    private readonly loanDocuments: DocumentSummaryDto[],
    public readonly showErrors: boolean,
  ) {
    super(dto, showErrors);
  }

  public documents = this.validateDocuments();
  public comments = this.validateComments();

  private validateDocuments(): Result {
    const hasDocuments = this.loanDocuments.length > 0;

    return Validation.isTrue(
      this,
      hasDocuments,
      "The request is only accepted when at least 1 document has been uploaded.",
    );
  }

  private validateComments(): Result {
    const { comments } = this.dto;

    // Note: We allow no comments
    if (comments.length === 0) return Validation.valid(this);

    const minCharLimit = 2;

    return Validation.minLength(
      this,
      comments,
      minCharLimit,
      `You must enter at least ${minCharLimit} characters as a comment.`,
    );
  }
}
