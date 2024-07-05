import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeleteProjectDocumentCommand extends CommandBase<void> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly documentId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.projectId);

    if (!documentExists) return false;

    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
