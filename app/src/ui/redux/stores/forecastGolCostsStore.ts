import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { getForecastDetailsForPartnerKey } from "@ui/redux/stores/storeKeys";

export class ForecastGolCostsStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData("forecastGolCosts", getForecastDetailsForPartnerKey(partnerId), p => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...p}));
  }
}
