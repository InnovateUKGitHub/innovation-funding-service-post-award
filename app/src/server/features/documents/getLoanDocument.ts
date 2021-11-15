import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { DocumentQueryBase } from "./documentQueryBase";

export class GetLoanDocumentQuery extends DocumentQueryBase {
  constructor(private readonly projectId: string, private readonly loanId: string, documentId: string) {
    super(documentId);
  }

  protected async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const loan = await context.repositories.loans.getWithoutTotals(this.projectId, this.loanId);

    if (!loan) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected getRecordId(): Promise<string | null> {
    return Promise.resolve(this.loanId);
  }
}
