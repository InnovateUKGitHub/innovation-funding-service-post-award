import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "@server/features/documents/documentQueryBase";

export class GetProjectChangeRequestDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, private readonly projectChangeRequestItemId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(context: IContext): Promise<string | null> {
    return Promise.resolve(this.projectChangeRequestItemId);
  }
}
