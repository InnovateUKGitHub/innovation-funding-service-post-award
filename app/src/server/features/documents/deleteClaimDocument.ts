import { CommandBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class DeleteClaimDocumentCommand extends CommandBase<void> {
    constructor(private readonly documentId: string, private readonly claimKey: ClaimKey) {
        super();
    }

    async accessControl(auth: Authorisation, context: IContext) {
        const claim = await context.repositories.claims.get(this.claimKey.partnerId, this.claimKey.periodId);
        if (!claim) return false;

        const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, claim.Id);
        if (!documentExists) return false;

        // If a project prole (e.g. MO or PM) is used for auth then the claim needs to be looked up by projectId as well as partner & period
        return auth.forPartner(this.claimKey.projectId, this.claimKey.partnerId).hasRole(ProjectRole.FinancialContact);
    }

    protected async Run(context: IContext) {
        return context.repositories.documents.deleteDocument(this.documentId);
    }
}
