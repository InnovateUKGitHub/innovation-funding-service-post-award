import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase } from "@server/features/common";

export class DeleteProjectChangeRequestItemDocument extends CommandBase<void> {
  constructor(private readonly documentId: string, private readonly projectId: string, private readonly projectChangeRequestIdOrItemId: string) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const projectChangeRequestExists = await context.repositories.pcrs.isExisting(this.projectId, this.projectChangeRequestIdOrItemId);
    if (!projectChangeRequestExists) return false;

    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.projectChangeRequestIdOrItemId);
    if (!documentExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext) {
    return context.repositories.documents.deleteDocument(this.documentId);
  }
}
