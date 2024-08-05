import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetPartnerDocumentQuery extends DocumentQueryBase {
  public readonly runnableName: string = "GetPartnerDocumentQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    documentId: string,
  ) {
    super(documentId);
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return (
      auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact, ProjectRole.ProjectManager)
    );
  }

  protected getRecordId(): Promise<string | null> {
    return Promise.resolve(this.partnerId);
  }
}
