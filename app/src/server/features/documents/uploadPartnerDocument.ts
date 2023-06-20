import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandMultipleDocumentBase } from "../common/commandBase";
import { ValidationError } from "../common/appError";

export class UploadPartnerDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  protected logMessage() {
    return [this.constructor.name, { projectId: this.projectId }, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
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
