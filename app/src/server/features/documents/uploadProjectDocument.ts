import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class UploadProjectDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(private readonly projectId: ProjectId, protected readonly documents: MultipleDocumentUploadDto) {
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

    const docsWithNameAndSize = this.documents.files.filter(x => x.fileName && x.size);
    const promisedDocs: Promise<string>[] = docsWithNameAndSize.map(document =>
      context.repositories.documents.insertDocument(document, recordId, this.documents.description),
    );

    return await Promise.all(promisedDocs);
  }
}
