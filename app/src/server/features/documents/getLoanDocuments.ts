import { ProjectRole } from "@framework/constants/project";
import { DocumentEntity } from "@framework/entities/document";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { DocumentsSummaryQueryBase } from "./documentsSummaryQueryBase";

export class GetLoanDocumentsQuery extends DocumentsSummaryQueryBase {
  constructor(private readonly projectId: ProjectId, private readonly loanId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext): Promise<boolean> {
    const loan = await context.repositories.loans.get(this.projectId, { loanId: this.loanId });

    if (!loan) return false;

    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  protected getRecordId(): Promise<string> {
    return Promise.resolve(this.loanId);
  }

  protected getUrl(document: DocumentEntity): string {
    return `/api/documents/loans/${this.projectId}/${this.loanId}/${document.id}/content`;
  }
}
