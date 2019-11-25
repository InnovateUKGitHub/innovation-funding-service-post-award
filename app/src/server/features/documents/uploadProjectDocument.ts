import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase, ValidationError } from "@server/features/common";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";

export class UploadProjectDocumentCommand extends CommandBase<string[]> {
  constructor(
    private readonly projectId: string,
    private readonly documents: MultipleDocumentUploadDto
  ) {
    super();
  }

  protected LogMessage() {
    return [this.constructor.name, { projectId: this.projectId }, this.documents && this.documents.files && this.documents.files.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async Run(context: IContext) {
    const result = new MultipleDocumentUpdloadDtoValidator(this.documents, context.config, true, true);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const results: string[] = [];

    for (const document of this.documents.files.filter(x => x.fileName && x.size)) {
      const id = await context.repositories.documents.insertDocument(document, this.projectId, this.documents.description);
      results.push(id);
    }

    return results;
  }
}
