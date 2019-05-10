import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { FileUploadValidator } from "@ui/validators/documentUploadValidator";
import { ClaimDto, ClaimStatus, DocumentDescription, FileUpload, IContext } from "@framework/types";
import mapClaim from "@server/features/claims/mapClaim";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocuments";
import { DeleteDocumentCommand } from "@server/features/documents/deleteDocument";
import { UploadDocumentCommand } from "@server/features/documents/uploadDocument";
import { GetClaim, UpdateClaimCommand } from "../claims";

export class UploadClaimDocumentCommand extends CommandBase<string> {
  constructor(private readonly claimKey: ClaimKey, private readonly file: FileUpload) {
    super();
  }

  private validateIarUpload(claim: ClaimDto) {
    if (!claim.isIarRequired || !claim.allowIarEdit) {
      throw new BadRequestError("IAR is not required for this claim " + claim.id);
    }
  }

  private async preIarUpload(context: IContext, claim: ClaimDto) {
    this.validateIarUpload(claim);
    const iarDocuments = await context.runQuery(new GetClaimDocumentsQuery(this.claimKey, { description: DocumentDescription.IAR }));
    await Promise.all(iarDocuments.map(doc => context.runCommand(new DeleteDocumentCommand(doc.id))));
  }

  private async postIarUpload(context: IContext, claim: ClaimDto) {
    if (claim.status !== ClaimStatus.AWAITING_IAR) return;

    claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const projectId = await context.repositories.partners.getById(this.claimKey.partnerId).then(x => x.Acc_ProjectId__c);

    const command = new  UpdateClaimCommand(projectId, claim);

    await context.runCommand(command);
  }

  protected async Run(context: IContext) {
    const result = new FileUploadValidator(this.file, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(mapClaim(context));

    if (this.file.description === DocumentDescription.IAR) await this.preIarUpload(context, claim);

    const documentId = await context.runCommand(new UploadDocumentCommand(this.file, claim.id));

    if (this.file.description === DocumentDescription.IAR) await this.postIarUpload(context, claim);

    return documentId;
  }
}
