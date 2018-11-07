import {ICommand, IContext} from "../common/context";
import {UploadDocumentCommand} from "./uploadDocument";

export class UploadClaimDetailDocumentCommand implements ICommand<string> {
  constructor(private claimDetailKey: ClaimDetailKey, private file: FileUpload) {
  }

  public async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);
    return context.runQuery(new UploadDocumentCommand(this.file, claimDetail.Id));
  }
}
