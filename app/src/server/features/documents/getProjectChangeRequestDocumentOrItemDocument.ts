import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { DocumentQueryBase } from "@server/features/documents/documentQueryBase";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class GetProjectChangeRequestDocumentOrItemDocumentQuery extends DocumentQueryBase {
  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestIdOrItemId: string,
    documentId: string,
  ) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(
      this.projectId,
      this.projectChangeRequestIdOrItemId,
    );

    if (!projectChangeRequestExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }
}
