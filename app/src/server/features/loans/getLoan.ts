import { QueryBase } from "@server/features/common";
import { LoanDto, IContext, ProjectRole, Authorisation } from "@framework/types";

export class GetLoan extends QueryBase<LoanDto> {
  constructor(
    private readonly withTotals: boolean,
    private readonly projectId: string,
    private readonly loanId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  public async run(context: IContext): Promise<LoanDto> {
    const loanRequest = this.withTotals
      ? context.repositories.loans.getWithTotals(this.projectId, this.loanId)
      : context.repositories.loans.getWithoutTotals(this.projectId, this.loanId);

    return await loanRequest;
  }
}
