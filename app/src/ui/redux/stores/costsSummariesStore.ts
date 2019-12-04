import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class CostSummariesStore extends StoreBase {
  public getForPeriod(projectId: string, partnerId: string, periodId: number) {
    return this.getData("costsSummary", this.buildKey(projectId, partnerId, periodId), p => ApiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...p}));
  }
}
