import { QueryBase } from "../common";
import { Authorisation, IContext, ProjectRole } from "../../../types";
import mapClaimLineItem from "./mapClaimLineItem";

export class GetAllLineItemsForClaimByCategoryQuery extends QueryBase<ClaimLineItemDto[]> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly costCategoryId: string,
    private readonly periodId: number
  ) {
    super();
  }

  // TODO tighten up auth
  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.MonitoringOfficer)
    || auth.forPartner(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);
  }

  protected async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];
    return data.map<ClaimLineItemDto>(mapClaimLineItem());
  }
}
