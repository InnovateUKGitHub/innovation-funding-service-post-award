import { Authorisation, FileUpload, IContext, ProjectRole } from "@framework/types";
import { CommandBase, ValidationError } from "@server/features/common";
import { FileUploadValidator } from "@ui/validators/documentUploadValidator";

export class UploadProjectDocumentCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly file: FileUpload
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const result = new FileUploadValidator(this.file, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return context.repositories.documents.insertDocument(this.file, this.projectId);
  }
}
