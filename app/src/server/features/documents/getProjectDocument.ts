import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetProjectDocumentQuery extends DocumentQueryBase {
  public readonly runnableName: string = "GetProjectDocumentQuery";
  constructor(
    private readonly projectId: ProjectId,
    documentId: string,
  ) {
    super(documentId);
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectId);
  }
}
