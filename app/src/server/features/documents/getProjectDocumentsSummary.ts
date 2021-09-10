import { Authorisation, ProjectRole } from "@framework/types";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetProjectDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/projects/${this.projectId}/${document.id}/content`;
  }
}
