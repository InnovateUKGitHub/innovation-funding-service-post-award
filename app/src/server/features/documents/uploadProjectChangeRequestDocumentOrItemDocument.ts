import { ProjectRolePermissionBits } from "@framework/constants/project";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { ValidationError } from "../common/appError";
import { CommandMultipleDocumentBase } from "../common/commandBase";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class UploadProjectChangeRequestDocumentOrItemDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  public readonly runnableName: string = "UploadProjectChangeRequestDocumentOrItemDocumentCommand";
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestIdOrItemId: PcrId | PcrItemId,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(
      this.projectId,
      this.projectChangeRequestIdOrItemId,
    );
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.ProjectManager);
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
