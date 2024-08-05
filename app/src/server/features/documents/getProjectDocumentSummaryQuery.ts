import { ProjectRole } from "@framework/constants/project";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetProjectDocumentSummaryQuery extends DocumentsSummaryQueryBase {
  public readonly runnableName: string = "GetProjectDocumentSummaryQuery";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  async accessControl(auth: Authorisation): Promise<boolean> {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/projects/${this.projectId}/${document.id}/content`;
  }
}
