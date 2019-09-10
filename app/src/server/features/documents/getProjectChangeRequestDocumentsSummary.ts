import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "@server/features/documents/documentsSummaryQueryBase";
import { ISalesforceDocument } from "@server/repositories";

export class GetProjectChangeRequestDocumentsSummaryQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.pcrs.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext) {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }

  protected getUrl(document: ISalesforceDocument) {
    return `/api/documents/projectChangeRequests/${this.projectChangeRequestIdOrItemId}/${document.Id}/content`;
  }
}
