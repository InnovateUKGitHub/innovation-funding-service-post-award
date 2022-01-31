import { QueryBase } from "@server/features/common";
import { LoanDto, IContext, ProjectRole, Authorisation } from "@framework/types";

export class GetLoan extends QueryBase<LoanDto> {
  constructor(
    private readonly projectId: string,
    private readonly options: {
      loanId?: string;
      periodId?: number;
    },
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  public async run(context: IContext) {
    const { loans } = context.repositories;

    return await loans.get(this.projectId, this.options);
  }
}
