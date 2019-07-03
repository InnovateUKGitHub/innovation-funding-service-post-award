import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { DocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class UploadClaimDetailDocumentCommand extends CommandBase<string> {
  constructor(
    private readonly claimDetailKey: ClaimDetailKey,
    private readonly document: DocumentUploadDto
    ) {
    super();
  }

  protected LogMessage() {
    return ["UploadClaimDetailDocumentCommand", this.claimDetailKey, this.document && this.document.file && this.document.file.fileName];
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);

    if (!claimDetail) {
      throw new BadRequestError("No Claim Detail");
    }

    const result = new DocumentUploadDtoValidator(this.document, context.config.maxFileSize, true);
    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return context.repositories.documents.insertDocument(this.document.file!, claimDetail.Id, this.document.description);
  }
}
