import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandMultipleDocumentBase } from "../common/commandBase";

export class UploadClaimDetailDocumentCommand extends CommandMultipleDocumentBase<string[]> {
  public readonly runnableName: string = "UploadClaimDetailDocumentCommand";
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly claimDetailKey: ClaimDetailKey,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  logMessage() {
    return {
      ...this.claimDetailKey,
      documents: this.documents,
    };
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId)
      .hasRole(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);

    if (!claimDetail) {
      throw new BadRequestError("No Claim Detail");
    }

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
          claimDetail.Id,
          this.documents.description,
        );
        results.push(id);
      }
    }

    return results;
  }
}
