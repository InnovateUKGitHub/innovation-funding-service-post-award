import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { StoreBase } from "./storeBase";

export class ForecastGolCostsStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData(
      "forecastGolCosts",
      storeKeys.getPartnerKey(partnerId),
        p => apiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...p}));
  }
}
