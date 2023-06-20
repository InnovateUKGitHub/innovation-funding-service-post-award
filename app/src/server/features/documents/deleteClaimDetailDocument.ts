import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { ClaimDetailKey } from "@framework/types/ClaimDetailKey";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeleteClaimDetailDocumentCommand extends CommandBase<void> {
  constructor(private readonly documentId: string, private readonly claimDetailKey: ClaimDetailKey) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey);

    if (!claimDetail) return false;

    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, claimDetail.Id);

    if (!documentExists) return false;

    return auth
      .forPartner(this.claimDetailKey.projectId, this.claimDetailKey.partnerId)
      .hasRole(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
