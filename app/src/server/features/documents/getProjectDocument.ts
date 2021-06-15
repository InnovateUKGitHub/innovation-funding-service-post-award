import { Authorisation, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetProjectDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(): Promise<string | null> {
    return Promise.resolve(this.projectId);
  }
}
