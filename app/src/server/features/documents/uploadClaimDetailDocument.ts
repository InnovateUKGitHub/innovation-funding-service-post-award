import { BadRequestError, CommandBase, ValidationError } from "../common";
import { UploadDocumentCommand } from "./uploadDocument";
import { FileUploadValidator } from "../../../ui/validators/documentUploadValidator";
import { FileUpload, IContext } from "../../../types";

export class UploadClaimDetailDocumentCommand extends CommandBase<string> {
  constructor(private readonly claimDetailKey: ClaimDetailKey, private readonly file: FileUpload) {
    super();
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);
    const result = new FileUploadValidator(this.file, true);

    if (!claimDetail) {
      throw new BadRequestError("No Claim Detail");
    }

    if (!result.isValid) {
      throw new ValidationError(result);
    }
    return context.runCommand(new UploadDocumentCommand(this.file, claimDetail.Id));
  }
}
