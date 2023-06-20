// Uses either project change request Id or project change request item Id, as both cn be used as the entity Id of the document
import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeleteProjectChangeRequestDocumentOrItemDocument extends CommandBase<void> {
  constructor(
    private readonly documentId: string,
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

    const documentExists = await context.repositories.documents.isExistingDocument(
      this.documentId,
      this.projectChangeRequestIdOrItemId,
    );

    if (!documentExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
