import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { IContext } from "@framework/types/IContext";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetClaimDocumentQuery extends DocumentQueryBase {
  public readonly runnableName: string = "GetClaimDocumentQuery";
  constructor(
    private readonly claimKey: ClaimKey,
    documentId: string,
  ) {
    super(documentId);
  }

  async accessControl(auth: Authorisation) {
    return (
      auth
        .forPartner(this.claimKey.projectId, this.claimKey.partnerId)
        .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager) ||
      auth.forProject(this.claimKey.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer)
    );
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(x => x.Id);
  }
}
