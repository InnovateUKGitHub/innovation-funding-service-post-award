import { CommandBase, ValidationError } from "../common";
import { UploadDocumentCommand } from "./uploadDocument";
import { FileUploadValidator } from "../../../ui/validators/documentUploadValidator";
import { Authorisation, FileUpload, IContext, ProjectRole } from "../../../types";

export class UploadProjectDocumentCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly file: FileUpload
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return context.config.features.projectDocuments && auth.for(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const result = new FileUploadValidator(this.file, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return context.runCommand(new UploadDocumentCommand(this.file, this.projectId));
  }
}
