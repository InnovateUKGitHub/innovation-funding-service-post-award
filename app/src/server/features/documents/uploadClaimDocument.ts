import { DeleteClaimDocumentCommand } from "@server/features/documents/deleteClaimDocument";
import { DocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { mapClaim } from "@server/features/claims/mapClaim";
import { GetClaimDocumentsQuery } from "@server/features/documents/getClaimDocumentsSummary";
import { DocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDto } from "@framework/dtos/claimDto";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IContext } from "@framework/types/IContext";
import { UpdateClaimCommand } from "../claims/updateClaim";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandDocumentBase } from "../common/commandBase";

export class UploadClaimDocumentCommand extends CommandDocumentBase<string> {
  protected showValidationErrors = true;

  constructor(private readonly claimKey: ClaimKey, protected readonly document: DocumentUploadDto) {
    super();
  }

  protected logMessage() {
    return [this.constructor.name, this.claimKey, this.document && this.document.file && this.document.file.fileName];
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  private async preIarUpload(context: IContext, claim: ClaimDto): Promise<void> {
    if (!claim.isIarRequired || !claim.allowIarEdit) {
      throw new BadRequestError("IAR is not required for this claim " + claim.id);
    }

    const claimDocumentQuery = new GetClaimDocumentsQuery(this.claimKey, { description: DocumentDescription.IAR });

    const iarDocuments = await context.runQuery(claimDocumentQuery);

    const iarPromisedDocuments = iarDocuments.map(doc =>
      context.runCommand(new DeleteClaimDocumentCommand(doc.id, this.claimKey)),
    );

    await Promise.all(iarPromisedDocuments);
  }

  private async postIarUpload(context: IContext, claim: ClaimDto): Promise<void> {
    if (claim.status !== ClaimStatus.AWAITING_IAR) return;

    claim.status = ClaimStatus.AWAITING_IUK_APPROVAL;

    const command = new UpdateClaimCommand(this.claimKey.projectId, claim);

    await context.runCommand(command);
  }

  protected async run(context: IContext): Promise<string> {
    const result = new DocumentUploadDtoValidator(this.document, context.config.options, this.showValidationErrors);

    if (!result.isValid) {
      throw new ValidationError(result);
    }

    const partner = await context.repositories.partners.getById(this.claimKey.partnerId);
    const claim = await context.repositories.claims
      .get(this.claimKey.partnerId, this.claimKey.periodId)
      .then(x => mapClaim(context)(x, partner.competitionType));

    if (this.document.description === DocumentDescription.IAR) await this.preIarUpload(context, claim);

    const documentId = await context.repositories.documents.insertDocument(
      this.document.file as IFileWrapper,
      claim.id,
      this.document.description,
    );

    if (this.document.description === DocumentDescription.IAR) await this.postIarUpload(context, claim);

    return documentId;
  }
}
