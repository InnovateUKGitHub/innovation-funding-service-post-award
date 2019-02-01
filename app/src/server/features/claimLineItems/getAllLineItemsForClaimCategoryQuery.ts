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

  protected async accessControl(auth: Authorisation) {
    return auth.for(this.projectId, this.partnerId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];
    return data.map<ClaimLineItemDto>(mapClaimLineItem());
  }
}
