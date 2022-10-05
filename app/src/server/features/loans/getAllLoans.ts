import { QueryBase } from "@server/features/common";
import { LoanDto, Authorisation, IContext, ProjectRole } from "@framework/types";

export class GetAllLoans extends QueryBase<LoanDto[]> {
  constructor(private readonly projectId: string) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager, ProjectRole.FinancialContact);
  }

  public async run(context: IContext): Promise<LoanDto[]> {
    return await context.repositories.loans.getAll(this.projectId);
  }
}
