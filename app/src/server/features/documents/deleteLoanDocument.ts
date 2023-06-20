import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { CommandBase } from "../common/commandBase";

export class DeleteLoanDocument extends CommandBase<void> {
  constructor(
    private readonly documentId: string,
    private readonly projectId: ProjectId,
    private readonly loanId: string,
  ) {
    super();
  }

  async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const loan = await context.repositories.loans.get(this.projectId, { loanId: this.loanId });

    if (!loan) return false;

    const documentExists = await context.repositories.documents.isExistingDocument(this.documentId, this.loanId);

    if (!documentExists) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
