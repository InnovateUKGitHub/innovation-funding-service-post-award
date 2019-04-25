import { Authorisation, FileUpload, IContext, ProjectRole } from "@framework/types";
import { CommandBase, ValidationError } from "@server/features/common";
import { FileUploadValidator } from "@ui/validators/documentUploadValidator";
import { UploadDocumentCommand } from "@server/features/documents/uploadDocument";

export class UploadProjectDocumentCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly file: FileUpload
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const result = new FileUploadValidator(this.file, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return context.runCommand(new UploadDocumentCommand(this.file, this.projectId));
  }
}
