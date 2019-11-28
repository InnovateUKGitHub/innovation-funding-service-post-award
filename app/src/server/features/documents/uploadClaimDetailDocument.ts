import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class UploadClaimDetailDocumentCommand extends CommandBase<string[]> {
  constructor(
    private readonly claimDetailKey: ClaimDetailKey,
    private readonly documents: MultipleDocumentUploadDto
    ) {
    super();
  }

  protected LogMessage() {
    return ["UploadClaimDetailDocumentCommand", this.claimDetailKey, this.documents && this.documents.files && this.documents.files.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);

    if (!claimDetail) {
      throw new BadRequestError("No Claim Detail");
    }

    const result = new MultipleDocumentUpdloadDtoValidator(this.documents, context.config, true, true);
    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const results: string[] = [];

    for (const document of this.documents.files.filter(x => x.fileName && x.size)) {
      const id = await context.repositories.documents.insertDocument(document, claimDetail.Id, this.documents.description);
      results.push(id);
    }

    return results;
  }
}
