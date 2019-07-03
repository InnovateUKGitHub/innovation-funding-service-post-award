import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase, ValidationError } from "@server/features/common";
import { DocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";

export class UploadProjectDocumentCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly document: DocumentUploadDto
  ) {
    super();
  }

  protected LogMessage() {
    return [this.constructor.name, { projectId: this.projectId }, this.document && this.document.file && this.document.file.fileName];
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const result = new DocumentUploadDtoValidator(this.document, context.config.maxFileSize, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    return context.repositories.documents.insertDocument(this.document.file!, this.projectId, this.document.description);
  }
}
