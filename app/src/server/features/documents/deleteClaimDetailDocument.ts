import { CommandBase } from "@server/features/common";
import { Authorisation, ClaimDetailKey, IContext, ProjectRole } from "@framework/types";

export class DeleteClaimDetailDocumentCommand extends CommandBase<void> {
  constructor(private readonly documentId: string, private readonly claimDetailKey: ClaimDetailKey) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);
    if (!claimDetail) return false;

    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, claimDetail.Id);
    if (!documentExists) return false;

    return auth.forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    return context.repositories.documents.deleteDocument(this.documentId);
  }
}
