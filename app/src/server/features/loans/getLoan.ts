import { QueryBase } from "@server/features/common";
import { LoanDto, IContext, ProjectRole, Authorisation, LoanDtoWithTotals } from "@framework/types";

export class GetLoan extends QueryBase<LoanDto | LoanDtoWithTotals> {
  constructor(
    private readonly withTotals: boolean = true,
    private readonly projectId: string,
    private readonly loanId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  public async run(context: IContext) {
    const { loans } = context.repositories;

    const loanRequest = this.withTotals
      ? loans.getWithTotals(this.projectId, this.loanId)
      : loans.getWithoutTotals(this.projectId, this.loanId);

    return await loanRequest;
  }
}
