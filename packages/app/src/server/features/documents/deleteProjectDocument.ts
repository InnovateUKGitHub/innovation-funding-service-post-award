import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";

export class DeleteProjectDocumentCommand extends AuthorisedAsyncCommandBase<void> {
  public readonly runnableName: string = "DeleteProjectDocumentCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly documentId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.projectId);

    if (!documentExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
