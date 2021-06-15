import { Authorisation, ProjectRole } from "@framework/types";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetProjectDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId() {
    return Promise.resolve(this.projectId);
  }

  protected getUrl(document: DocumentEntity) {
    return `/api/documents/projects/${this.projectId}/${document.id}/content`;
  }
}
