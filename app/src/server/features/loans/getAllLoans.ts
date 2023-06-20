import { ProjectRole } from "@framework/constants/project";
import { LoanDto } from "@framework/dtos/loanDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetAllLoans extends QueryBase<LoanDto[]> {
  constructor(private readonly projectId: ProjectId) {
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
