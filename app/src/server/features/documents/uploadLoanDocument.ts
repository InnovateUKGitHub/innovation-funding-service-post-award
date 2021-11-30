import { BadRequestError, CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class UploadLoanDocumentsCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    protected readonly documents: MultipleDocumentUploadDto,
    private readonly projectId: string,
    private readonly loanId: string,
  ) {
    super();
  }

  protected logMessage() {
    return ["UploadLoanDocumentsCommand", this.loanId, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const loan = await context.repositories.loans.getWithoutTotals(this.projectId, this.loanId);

    if (!loan) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<string[]> {
    const loan = await context.repositories.loans.getWithoutTotals(this.projectId, this.loanId);

    if (!loan) {
      throw new BadRequestError(`We cannot attach a document to loan '${this.loanId}' as it could not be found.`);
    }

    const result = new MultipleDocumentUploadDtoValidator(
      this.documents,
      context.config.options,
      this.filesRequired,
      this.showValidationErrors,
      null,
    );

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return super.dispatchAction(this.documents.files, doc =>
      context.repositories.documents.insertDocument(doc, loan.id, this.documents.description),
    );
  }
}
