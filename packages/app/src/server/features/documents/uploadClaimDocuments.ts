import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandMultipleDocumentBase } from "../common/commandBase";

export class UploadClaimDocumentsCommand extends CommandMultipleDocumentBase<string[]> {
  public readonly runnableName = "UploadClaimDocumentsCommand";

  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(
    private readonly claimKey: ClaimKey,
    protected readonly documents: MultipleDocumentUploadDto,
  ) {
    super();
  }

  logMessage() {
    return {
      ...this.claimKey,
      documents: this.documents,
    };
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer) ||
      auth
        .forPartner(this.claimKey.projectId, this.claimKey.partnerId)
        .hasRole(ProjectRolePermissionBits.FinancialContact)
    );
  }

  protected async run(context: IContext): Promise<string[]> {
    const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);

    if (!claim) {
      throw new BadRequestError("No Claim");
    }

    const result = new MultipleDocumentUploadDtoValidator(
      this.documents,
      context.config.options,
      this.filesRequired,
      this.showValidationErrors,
      null,
      mapImpactManagementParticipationToEnum(claim.Impact_Management_Participation__c),
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
        const id = await context.repositories.documents.insertDocument(document, claim.Id, this.documents.description);
        results.push(id);
      }
    }

    return results;
  }
}
