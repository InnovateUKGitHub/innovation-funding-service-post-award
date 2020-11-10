import { QueryBase } from "@server/features/common";
import { Authorisation, ClaimDetailsDto, IContext, ProjectRole } from "@framework/types";
import { mapClaimDetails } from "./mapClaimDetails";

export class GetClaimDetailsQuery extends QueryBase<ClaimDetailsDto> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly periodId: number,
    private readonly costCategoryId: string,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer)
    || auth.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get({ projectId: this.projectId, partnerId: this.partnerId, periodId: this.periodId, costCategoryId: this.costCategoryId });
    const lineItems = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];

    if (!claimDetail) {
      // @TODO: throw once overheads renenabled?
      return ({
        partnerId: this.partnerId,
        costCategoryId: this.costCategoryId,
        periodId: this.periodId,
        periodStart: null,
        periodEnd: null,
        value: 0,
        comments: null,
        lineItems: [] // @TODO move clientside logic here?
      });
    }
    return mapClaimDetails(claimDetail, lineItems, context);
  }
}
