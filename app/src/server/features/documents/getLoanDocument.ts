import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetLoanDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: ProjectId, private readonly loanId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const loan = await context.repositories.loans.get(this.projectId, { loanId: this.loanId });

    if (!loan) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected getRecordId(): Promise<string | null> {
    return Promise.resolve(this.loanId);
  }
}
