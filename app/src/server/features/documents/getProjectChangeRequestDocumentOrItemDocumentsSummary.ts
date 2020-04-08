import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentsSummaryQueryBase } from "@server/features/documents/documentsSummaryQueryBase";
import { DocumentEntity } from "@framework/entities/document";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  protected getRecordId(context: IContext) {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }

  protected getUrl(document: DocumentEntity) {
    return `/api/documents/projectChangeRequests/${this.projectId}/${this.projectChangeRequestIdOrItemId}/${document.id}/content`;
  }
}
