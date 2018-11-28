import { IContext, CommandBase} from "../common/context";
import {UploadDocumentCommand} from "./uploadDocument";
import { FileUpload } from "../../../types/FileUpload";

export class UploadClaimDetailDocumentCommand extends CommandBase<string> {
  constructor(private claimDetailKey: ClaimDetailKey, private file: FileUpload) {
    super();
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);
    return context.runCommand(new UploadDocumentCommand(this.file, claimDetail.Id));
  }
}
