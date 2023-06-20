import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { IContext } from "@framework/types/IContext";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetClaimDetailDocumentQuery extends DocumentQueryBase {
  constructor(private readonly claimKey: ClaimDetailKey, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth
        .forPartner(this.claimKey.projectId, this.claimKey.partnerId)
        .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager) ||
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer)
    );
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return context.repositories.claimDetails.get(this.claimKey).then(x => x && x.Id);
  }
}
