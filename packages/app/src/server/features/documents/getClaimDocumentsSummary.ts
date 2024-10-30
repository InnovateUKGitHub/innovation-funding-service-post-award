import { ProjectRolePermissionBits } from "@framework/constants/project";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimKey } from "@framework/types/ClaimKey";
import { DocumentFilter } from "@framework/types/DocumentFilter";
import { IContext } from "@framework/types/IContext";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetClaimDocumentsQuery extends DocumentsSummaryQueryBase {
  public readonly runnableName: string = "GetClaimDocumentsQuery";
  constructor(
    private readonly claimKey: ClaimKey,
    filter?: DocumentFilter,
  ) {
    super(filter);
  }

  async accessControl(auth: Authorisation) {
    return (
      auth
        .forPartner(this.claimKey.projectId, this.claimKey.partnerId)
        .hasRole(ProjectRolePermissionBits.FinancialContact) ||
      auth
        .forProject(this.claimKey.projectId)
        .hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer, ProjectRolePermissionBits.ProjectManager)
    );
  }

  protected getRecordId(context: IContext): Promise<string> {
    return context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId).then(x => x.Id);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/claims/${this.claimKey.projectId}/${this.claimKey.partnerId}/${this.claimKey.periodId}/${document.id}/content`;
  }
}
