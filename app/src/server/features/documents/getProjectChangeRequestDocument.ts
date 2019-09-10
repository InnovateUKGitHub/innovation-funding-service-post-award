import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "@server/features/documents/documentQueryBase";

export class GetProjectChangeRequestDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.pcrs.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }
}
