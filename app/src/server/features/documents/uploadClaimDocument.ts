import { CommandBase, IContext } from "../common/context";
import { UploadDocumentCommand } from "./uploadDocument";
import { GetClaimDocumentsQuery } from "./getClaimDocuments";
import { ApiError, StatusCode } from "../../apis/ApiError";
import mapClaim from "../claims/mapClaim";
import { DeleteDocumentCommand } from "./deleteDocument";
import { ClaimDto, ClaimStatus, DocumentDescription } from "../../../types";
import { FileUpload } from "../../../types/FileUpload";

export class UploadClaimDocumentCommand extends CommandBase<string> {
  constructor(private claimKey: ClaimKey, private file: FileUpload) {
    super();
  }

  private validateIarUpload(claim: ClaimDto) {
    if (!claim.isIarRequired || !claim.allowIarEdit) {
      throw new ApiError(StatusCode.BAD_REQUEST, "IAR is not required for this claim " + claim.id);
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
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(mapClaim(context));

    if (this.file.description === DocumentDescription.IAR) await this.preIarUpload(context, claim);

    const documentId = context.runCommand(new UploadDocumentCommand(this.file, claim.id));

    if (this.file.description === DocumentDescription.IAR) await this.postIarUpload(context, claim);

    return documentId;
  }
}
