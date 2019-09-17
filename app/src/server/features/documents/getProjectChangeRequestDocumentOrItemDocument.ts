import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "@server/features/documents/documentQueryBase";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class GetProjectChangeRequestDocumentOrItemDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }
}
