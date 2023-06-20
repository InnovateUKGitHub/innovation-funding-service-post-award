import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeleteClaimDocumentCommand extends CommandBase<void> {
  constructor(private readonly documentId: string, private readonly claimKey: ClaimKey) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const claim = await context.repositories.claims.getByProjectId(
      this.claimKey.projectId,
      this.claimKey.partnerId,
      this.claimKey.periodId,
    );

    if (!claim) return false;

    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, claim.Id);

    if (!documentExists) return false;

    // If a project prole (e.g. MO or PM) is used for auth then the claim needs to be looked up by projectId as well as partner & period
    return (
      auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact) ||
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer)
    );
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
