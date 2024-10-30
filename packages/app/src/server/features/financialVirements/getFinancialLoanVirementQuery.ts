import { ProjectRolePermissionBits } from "@framework/constants/project";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetFinancialLoanVirementQuery extends AuthorisedAsyncQueryBase<FinancialLoanVirementDto> {
  public readonly runnableName: string = "GetFinancialLoanVirementQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrItemId: PcrItemId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.MonitoringOfficer, ProjectRolePermissionBits.ProjectManager);
  }

  protected async run(context: IContext): Promise<FinancialLoanVirementDto> {
    const loans = await context.repositories.financialLoanVirements.getForPcr(this.pcrItemId);

    return {
      pcrItemId: this.pcrItemId,
      loans,
    };
  }
}
