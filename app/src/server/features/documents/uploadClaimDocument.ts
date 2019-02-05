import { BadRequestError, CommandBase, ValidationError } from "../common";
import { UploadDocumentCommand } from "./uploadDocument";
import { GetClaimDocumentsQuery } from "./getClaimDocuments";
import { DeleteDocumentCommand } from "./deleteDocument";
import { FileUploadValidator } from "../../../ui/validators/documentUploadValidator";
import { ClaimDto, ClaimStatus, DocumentDescription, FileUpload, IContext } from "../../../types";
import mapClaim from "../claims/mapClaim";

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
    const updatedClaim = { Id: claim.id, Acc_ClaimStatus__c: ClaimStatus.AWAITING_IUK_APPROVAL };
    await context.repositories.claims.update(updatedClaim);
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
