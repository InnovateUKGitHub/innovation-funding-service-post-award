import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetProjectDocumentQuery extends DocumentQueryBase {
  constructor(
    private readonly projectId: ProjectId,
    documentId: string,
  ) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectId);
  }
}
