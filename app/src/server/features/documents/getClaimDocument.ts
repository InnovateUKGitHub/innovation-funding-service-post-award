import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { IContext } from "@framework/types/IContext";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetClaimDocumentQuery extends DocumentQueryBase {
  constructor(private readonly claimKey: ClaimKey, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation) {
    return (
      auth
        .forPartner(this.claimKey.projectId, this.claimKey.partnerId)
        .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager) ||
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRole.MonitoringOfficer)
    );
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(x => x.Id);
  }
}
