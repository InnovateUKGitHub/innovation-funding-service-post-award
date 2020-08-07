import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class UploadProjectDocumentCommand extends CommandMultipleDocumentBase<string[]> {

  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: string,
    protected readonly documents: MultipleDocumentUploadDto
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
    const result = new MultipleDocumentUpdloadDtoValidator(this.documents, context.config.options, this.filesRequired, this.showValidationErrors, null);

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
