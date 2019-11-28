import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { DocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, ClaimDto, ClaimStatus, DocumentDescription, IContext, ProjectRole } from "@framework/types";
import mapClaim from "@server/features/claims/mapClaim";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { UpdateClaimCommand } from "../claims";

export class UploadClaimDocumentCommand extends CommandBase<string> {
  constructor(private readonly claimKey: ClaimKey, private readonly document: DocumentUploadDto) {
    super();
  }

  protected LogMessage() {
    return [this.constructor.name, this.claimKey, this.document && this.document.file && this.document.file.fileName];
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
      return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  private validateIarUpload(claim: ClaimDto) {
    if (!claim.isIarRequired || !claim.allowIarEdit) {
      throw new BadRequestError("IAR is not required for this claim " + claim.id);
    }
  }

  private async preIarUpload(context: IContext, claim: ClaimDto) {
    this.validateIarUpload(claim);
    const iarDocuments = await context.runQuery(new GetClaimDocumentsQuery(this.claimKey, { description: DocumentDescription.IAR }));
    await Promise.all(iarDocuments.map(doc => context.runCommand(new DeleteClaimDocumentCommand(doc.id, this.claimKey))));
  }

  private async postIarUpload(context: IContext, claim: ClaimDto) {
    if (claim.status !== ClaimStatus.AWAITING_IAR) return;

    claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new  UpdateClaimCommand(this.claimKey.projectId, claim);

    await context.runCommand(command);
  }

  protected async Run(context: IContext) {
    const result = new DocumentUploadDtoValidator(this.document, context.config.maxFileSize, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(mapClaim(context));

    if (this.document.description === DocumentDescription.IAR) await this.preIarUpload(context, claim);

    const documentId = await context.repositories.documents.insertDocument(this.document.file!, claim.id, this.document.description);

    if (this.document.description === DocumentDescription.IAR) await this.postIarUpload(context, claim);

    return documentId;
  }
}
