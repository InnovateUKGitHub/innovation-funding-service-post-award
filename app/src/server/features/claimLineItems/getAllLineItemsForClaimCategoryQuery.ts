import {QueryBase} from "../common/queryBase";
import mapClaimLineItem from "./mapClaimLineItem";
import { Authorisation, ProjectRole } from "../../../types";
import { IContext } from "../../../types/IContext";

export class GetAllLineItemsForClaimByCategoryQuery extends QueryBase<ClaimLineItemDto[]> {
  constructor(public projectId: string, public partnerId: string, public costCategoryId: string, public periodId: number) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.hasProjectRole(this.projectId, ProjectRole.MonitoringOfficer)
      || auth.hasPartnerRole(this.projectId, this.partnerId, ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const data = await context.repositories.claimLineItems.getAllForCategory(this.partnerId, this.costCategoryId, this.periodId) || [];

    return data.map<ClaimLineItemDto>( mapClaimLineItem(context));
  }
}
