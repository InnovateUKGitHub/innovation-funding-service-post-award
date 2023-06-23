import { mapClaimDetails } from "./mapClaimDetails";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";

export class GetClaimDetailsQuery extends QueryBase<ClaimDetailsDto> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly periodId: number,
    private readonly costCategoryId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return (
      auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer) ||
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager)
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
