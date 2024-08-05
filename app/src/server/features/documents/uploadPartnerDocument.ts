import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandMultipleDocumentBase } from "../common/commandBase";
import { ValidationError } from "../common/appError";

export class UploadPartnerDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  public readonly runnableName: string = "UploadPartnerDocumentCommand";

  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  logMessage() {
    return {
      projectId: this.projectId,
      partnerId: this.partnerId,
      documents: this.documents,
    };
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    // Allow if the user is a MO, FC or PM of the partner.
    const canUploadAsPartner = auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact, ProjectRole.ProjectManager);

    if (canUploadAsPartner) return true;

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

    const results: string[] = [];

    // Process documents one at a time
    // This is because each file is 32mb of base64 encoded text.
    // Uploading ALL documents simultaneously would be disastrous for memory usage,
    // as each file needs to be loaded into memory.
    for (const document of this.documents.files) {
      if (document.fileName && document.size) {
        const id = await context.repositories.documents.insertDocument(
          document,
          this.partnerId,
          this.documents.description,
        );
        results.push(id);
      }
    }

    return results;
  }
}
