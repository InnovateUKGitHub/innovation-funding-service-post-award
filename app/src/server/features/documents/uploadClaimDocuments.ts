import { BadRequestError, CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, ClaimKey, IContext, ProjectRole } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class UploadClaimDocumentsCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(private readonly claimKey: ClaimKey, protected readonly documents: MultipleDocumentUploadDto) {
    super();
  }

  protected logMessage() {
    return [this.constructor.name, this.claimKey, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
      auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
    );
  }

  protected async run(context: IContext): Promise<string[]> {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);

    if (!claim) {
      throw new BadRequestError("No Claim");
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

    const docsWithNameAndSize = this.documents.files.filter(x => x.fileName && x.size);
    const promisedDocs: Promise<string>[] = docsWithNameAndSize.map(document =>
      context.repositories.documents.insertDocument(document, claim.Id, this.documents.description),
    );

    return await Promise.all(promisedDocs);
  }
}
