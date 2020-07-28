import { CommandBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class DeletePartnerDocumentCommand extends CommandBase<void> {
    constructor(private readonly documentId: string, private readonly projectId: string, private readonly partnerId: string) {
        super();
    }

    async accessControl(auth: Authorisation, context: IContext) {
        const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.partnerId);
        if (!documentExists) return false;
        return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
    }

    protected async Run(context: IContext) {
        return context.repositories.documents.deleteDocument(this.documentId);
    }
}
