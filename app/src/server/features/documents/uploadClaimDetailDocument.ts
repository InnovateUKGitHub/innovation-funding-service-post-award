import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { FileUploadValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, FileUpload, IContext, ProjectRole } from "@framework/types";
import { UploadDocumentCommand } from "@server/features/documents/uploadDocument";

export class UploadClaimDetailDocumentCommand extends CommandBase<string> {
  constructor(private readonly claimDetailKey: ClaimDetailKey, private readonly file: FileUpload) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId).hasRole(ProjectRole.FinancialContact);
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
