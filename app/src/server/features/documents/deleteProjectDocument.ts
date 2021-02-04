import { CommandBase } from "@server/features/common";
import { Authorisation, IContext, ProjectRole } from "@framework/types";

export class DeleteProjectDocumentCommand extends CommandBase<void> {
    constructor(private readonly projectId: string, private readonly documentId: string) {
        super();
    }

    async accessControl(auth: Authorisation, context: IContext) {
        const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.projectId);
        if (!documentExists) return false;
        return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer);
    }

    protected async Run(context: IContext) {
        return context.repositories.documents.deleteDocument(this.documentId);
    }
}
