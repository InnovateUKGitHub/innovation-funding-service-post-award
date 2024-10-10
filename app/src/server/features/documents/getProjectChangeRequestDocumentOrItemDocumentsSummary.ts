import { DocumentsSummaryQueryBase } from "@server/features/documents/documentsSummaryQueryBase";
import { DocumentEntity } from "@framework/entities/document";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document

export class GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery extends DocumentsSummaryQueryBase {
  public readonly runnableName: string = "GetProjectChangeRequestDocumentOrItemDocumentsSummaryQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly projectChangeRequestIdOrItemId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const projectChangeRequestExists = await context.repositories.projectChangeRequests.isExisting(
      this.projectId,
      this.projectChangeRequestIdOrItemId,
    );

    if (!projectChangeRequestExists) return false;

    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.projectChangeRequestIdOrItemId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/projectChangeRequests/${this.projectId}/${this.projectChangeRequestIdOrItemId}/${document.id}/content`;
  }
}
