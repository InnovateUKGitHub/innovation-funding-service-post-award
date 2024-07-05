import { ProjectRole } from "@framework/constants/project";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetFinancialLoanVirementQuery extends QueryBase<FinancialLoanVirementDto> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrItemId: PcrItemId,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  protected async run(context: IContext): Promise<FinancialLoanVirementDto> {
    const loans = await context.repositories.financialLoanVirements.getForPcr(this.pcrItemId);

    return {
      pcrItemId: this.pcrItemId,
      loans,
    };
  }
}
