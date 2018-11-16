import { ICommand, IContext } from "../common/context";
import { UploadDocumentCommand } from "./uploadDocument";
import { GetClaimDocumentsQuery } from "./getClaimDocuments";
import { ApiError, StatusCode } from "../../apis/ApiError";
import mapClaim from "../claims/mapClaim";
import { DeleteDocumentCommand } from "./deleteDocument";
import { ClaimDto, DocumentDescription } from "../../../types";
import { FileUpload } from "../../../types/FileUpload";

const validateIarUpload = async (context: IContext, claimKey: ClaimKey, claim: ClaimDto) => {
  if (!claim.isIarRequired || !claim.statusAllowsIar) {
    throw new ApiError(StatusCode.BAD_REQUEST, "IAR is not required for this claim " + claim.id);
  }
};

export class UploadClaimDocumentCommand implements ICommand<string> {
  constructor(private claimKey: ClaimKey, private file: FileUpload) {}

  public async Run(context: IContext) {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(mapClaim(context));

    if (this.file.description === DocumentDescription.IAR) {
      await validateIarUpload(context, this.claimKey, claim);
      const iarDocuments = await context.runQuery(new GetClaimDocumentsQuery(this.claimKey, DocumentDescription.IAR));
      await Promise.all(iarDocuments.map(doc => context.runCommand(new DeleteDocumentCommand(doc.id))));
    }

    return context.runQuery(new UploadDocumentCommand(this.file, claim.id));
  }
}
