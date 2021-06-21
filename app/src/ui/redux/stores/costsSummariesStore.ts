import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { StoreBase } from "./storeBase";

export class CostSummariesStore extends StoreBase {
  public getForPeriod(projectId: string, partnerId: string, periodId: number) {
    return this.getData("costsSummary", storeKeys.getClaimKey(partnerId, periodId), p => apiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...p}));
  }
}
