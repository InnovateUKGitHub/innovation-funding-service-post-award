import { ProjectRole } from "@framework/constants/project";
import { LoanDto } from "@framework/dtos/loanDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetLoan extends AuthorisedAsyncQueryBase<LoanDto> {
  public readonly runnableName: string = "GetAllLoans";
  constructor(
    private readonly projectId: ProjectId,
    private readonly options: {
      loanId?: string;
      periodId?: number;
    },
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  public async run(context: IContext) {
    const { loans } = context.repositories;

    return await loans.get(this.projectId, this.options);
  }
}
