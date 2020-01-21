import { QueryBase } from "../common/queryBase";
import { ClaimStatus, IContext } from "@framework/types";
import { Option } from "@framework/dtos/option";

export class GetClaimStatusesQuery extends QueryBase<Map<ClaimStatus, Option>> {
  protected async Run(context: IContext): Promise<Map<ClaimStatus, Option>> {
    return context.caches.claimStatuses.fetchAsync("All", () => this.executeQuery(context));
  }

  private async executeQuery(context: IContext) {
    const statuses = await context.repositories.claims.getClaimStatuses();
    return statuses.reduce((acc, curr) => acc.set(curr.value, {
      value: curr.value,
      label: curr.label,
      defaultValue: curr.defaultValue,
      active: curr.active
    }), new Map());
  }
}
