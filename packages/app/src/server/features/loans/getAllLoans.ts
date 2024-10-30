import { ProjectRolePermissionBits } from "@framework/constants/project";
import { LoanDto } from "@framework/dtos/loanDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetAllLoans extends AuthorisedAsyncQueryBase<LoanDto[]> {
  public readonly runnableName: string = "GetAllLoans";
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(
        ProjectRolePermissionBits.MonitoringOfficer,
        ProjectRolePermissionBits.ProjectManager,
        ProjectRolePermissionBits.FinancialContact,
      );
  }

  public async run(context: IContext): Promise<LoanDto[]> {
    return await context.repositories.loans.getAll(this.projectId);
  }
}
