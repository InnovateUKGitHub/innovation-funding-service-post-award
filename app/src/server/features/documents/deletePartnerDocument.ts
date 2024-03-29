import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeletePartnerDocumentCommand extends CommandBase<void> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId | LinkedEntityId,
    private readonly documentId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.partnerId);

    if (!documentExists) return false;

    return (
      auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager)
    );
  }

  protected async run(context: IContext) {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
