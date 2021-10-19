import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { CommandBase } from "@server/features/common";

export class DeletePartnerDocumentCommand extends CommandBase<void> {
  constructor(
    private readonly documentId: string,
    private readonly projectId: string,
    private readonly partnerId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.partnerId);

    return documentExists
      ? auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact)
      : false;
  }

  protected async run(context: IContext) {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
