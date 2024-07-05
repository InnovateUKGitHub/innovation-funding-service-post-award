import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandMultipleDocumentBase } from "../common/commandBase";
import { ValidationError } from "../common/appError";

export class UploadProjectDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: ProjectId,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  protected logMessage() {
    return [
      this.constructor.name,
      { projectId: this.projectId, partnerId: this.documents.partnerId },
      this.documents?.files?.map(x => x.fileName),
    ];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    // If a partner id is specified...
    if (this.documents.partnerId) {
      // Allow if the user is a MO, FC or PM of the partner.
      const canUploadAsPartner = auth
        .forPartner(this.projectId, this.documents.partnerId)
        .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact, ProjectRole.ProjectManager);

      if (canUploadAsPartner) return true;
    }

    // If a user is an MO for the project, allow.
    const canUploadAsProjectMo = auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);

    // If any of the above is true, allow
    if (canUploadAsProjectMo) return true;

    // User is unrelated to the project. Kick them out.
    return false;
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

    let recordId: string;

    // If the user has chosen to associate the file uploads with a partner...
    if (this.documents.partnerId) {
      // Change the record id to save to the partner id.
      recordId = this.documents.partnerId;
    } else {
      // Otherwise, associate the file upload based on project id.
      recordId = this.projectId;
    }

    const results: string[] = [];

    // Process documents one at a time
    // This is because each file is 32mb of base64 encoded text.
    // Uploading ALL documents simultaneously would be disastrous for memory usage,
    // as each file needs to be loaded into memory.
    for (const document of this.documents.files) {
      if (document.fileName && document.size) {
        const id = await context.repositories.documents.insertDocument(document, recordId, this.documents.description);
        results.push(id);
      }
    }

    return results;
  }
}
