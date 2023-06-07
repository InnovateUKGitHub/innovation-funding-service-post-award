import { BadRequestError, CommandMultipleDocumentBase, ValidationError } from "@server/features/common";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators/documentUploadValidator";
import { Authorisation, ClaimKey, IContext, ProjectRole } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { mapClaim } from "../claims/mapClaim";
import { mapImpactManagementParticipationToEnum } from "@framework/mappers/impactManagementParticipation";

export class UploadClaimDocumentsCommand extends CommandMultipleDocumentBase<string[]> {
  protected filesRequired = true;
  protected showValidationErrors = true;

  constructor(private readonly claimKey: ClaimKey, protected readonly documents: MultipleDocumentUploadDto) {
    super();
  }

  protected logMessage() {
    return [this.constructor.name, this.claimKey, this.documents?.files?.map(x => x.fileName)];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
      auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact)
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
