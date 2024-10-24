import { mapClaimDetails } from "./mapClaimDetails";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
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
      // @TODO: throw once overheads re-enabled?
      return {
        partnerId: this.partnerId,
        costCategoryId: this.costCategoryId,
        periodId: this.periodId,
        periodStart: null,
        periodEnd: null,
        value: 0,
        comments: null,
        isAuthor: false,
        lineItems: [], // @TODO move client-side logic here?
        grantPaidToDate: 0,
        impactManagementParticipation: ImpactManagementParticipation.Unknown,
      };
    }
    return mapClaimDetails(claimDetail, lineItems, context);
  }
}
