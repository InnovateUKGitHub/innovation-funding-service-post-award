import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class UploadProjectDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(private readonly projectId: string, protected readonly documents: MultipleDocumentUploadDto) {
    super();
  }

  protected logMessage() {
    return [this.constructor.name, { projectId: this.projectId }, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async run(context: IContext): Promise<string[]> {
    const result = new MultipleDocumentUploadDtoValidator(
      this.documents,
      context.config.options,
      this.filesRequired,
      this.showValidationErrors,
      null,
    );

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const docsWithNameAndSize = this.documents.files.filter(x => x.fileName && x.size);
    const promisedDocs: Promise<string>[] = docsWithNameAndSize.map(document =>
      context.repositories.documents.insertDocument(document, this.projectId, this.documents.description),
    );

    return await Promise.all(promisedDocs);
  }
}
