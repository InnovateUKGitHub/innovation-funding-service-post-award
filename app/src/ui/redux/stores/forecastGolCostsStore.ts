import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ForecastGolCostsStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData(
      "forecastGolCosts",
      storeKeys.getForecastDetailsForPartnerKey(partnerId),
        p => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...p}));
  }
}
