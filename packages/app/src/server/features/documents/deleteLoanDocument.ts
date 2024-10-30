import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";

export class DeleteLoanDocument extends AuthorisedAsyncCommandBase<void> {
  public readonly runnableName = "DeleteLoanDocument";

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

    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async run(context: IContext): Promise<void> {
    return await context.repositories.documents.deleteDocument(this.documentId);
  }
}
