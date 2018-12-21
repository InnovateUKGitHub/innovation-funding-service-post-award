import { CommandBase, IContext} from "../common/context";
import {UploadDocumentCommand} from "./uploadDocument";
import { FileUpload } from "../../../types/FileUpload";
import { FileUploadValidator } from "../../../ui/validators/documentUploadValidator";
import { ValidationError } from "../../../shared/validation";

export class UploadClaimDetailDocumentCommand extends CommandBase<string> {
  constructor(private claimDetailKey: ClaimDetailKey, private file: FileUpload) {
    super();
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);
    const result = new FileUploadValidator(this.file, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }
    return context.runCommand(new UploadDocumentCommand(this.file, claimDetail.Id));
  }
}
