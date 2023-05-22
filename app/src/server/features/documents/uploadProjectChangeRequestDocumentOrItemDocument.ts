import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class UploadProjectChangeRequestDocumentOrItemDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestIdOrItemId: string,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(
      this.projectId,
      this.projectChangeRequestIdOrItemId,
    );
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  protected async run(context: IContext) {
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

    const results: string[] = [];

    // Process documents one at a time
    // This is because each file is 32mb of base64 encoded text.
    // Uploading ALL documents simultaneously would be disastrous for memory usage,
    // as each file needs to be loaded into memory.
    for (const document of this.documents.files) {
      if (document.fileName && document.size) {
        const id = await context.repositories.documents.insertDocument(
          document,
          this.projectChangeRequestIdOrItemId,
          this.documents.description,
        );
        results.push(id);
      }
    }

    return results;
  }
}
