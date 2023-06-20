import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandMultipleDocumentBase } from "../common/commandBase";

export class UploadLoanDocumentsCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    protected readonly documents: MultipleDocumentUploadDto,
    private readonly projectId: ProjectId,
    private readonly loanId: string,
  ) {
    super();
  }

  protected logMessage() {
    return ["UploadLoanDocumentsCommand", this.loanId, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const loan = await context.repositories.loans.get(this.projectId, { loanId: this.loanId });

    if (!loan) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<string[]> {
    const loan = await context.repositories.loans.get(this.projectId, { loanId: this.loanId });

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
