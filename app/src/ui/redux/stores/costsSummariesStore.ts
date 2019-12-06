import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class CostSummariesStore extends StoreBase {
  public getForPeriod(projectId: string, partnerId: string, periodId: number) {
    return this.getData("costsSummary", storeKeys.getClaimKey(partnerId, periodId), p => ApiClient.costsSummary.getAllByPartnerIdForPeriod({projectId, partnerId, periodId, ...p}));
  }
}
