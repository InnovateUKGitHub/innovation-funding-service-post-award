import { mapClaimDetails } from "./mapClaimDetails";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";

export class GetClaimDetailsQuery extends AuthorisedAsyncQueryBase<ClaimDetailsDto> {
  public readonly runnableName: string = "GetClaimDetailsQuery";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: PeriodId,
    private readonly costCategoryId: CostCategoryId,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return (
      auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer) ||
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager)
    );
  }

  protected async run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get({
      projectId: this.projectId,
      partnerId: this.partnerId,
      periodId: this.periodId,
      costCategoryId: this.costCategoryId,
    });
    const lineItems = await context.repositories.claimLineItems.getAllForCategory(
      this.partnerId,
      this.costCategoryId,
      this.periodId,
    );

    if (!claimDetail) {
      throw new Error("there is no claim detail item for this period and cost category");
    }

    return mapClaimDetails(claimDetail, lineItems, context);
  }
}
