import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "@server/features/documents/documentsSummaryQueryBase";
import { ISalesforceDocument } from "@server/repositories";

export class GetProjectChangeRequestDocumentsSummaryQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext) {
    return Promise.resolve(this.projectChangeRequestItemId);
  }

  protected getUrl(document: ISalesforceDocument) {
    return `/api/documents/projectChangeRequests/${this.projectChangeRequestItemId}/${document.Id}/content`;
  }
}
