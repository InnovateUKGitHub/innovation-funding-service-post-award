import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class ForecastGolCostsStore extends StoreBase {
  public getAllByPartner(partnerId: string) {
    return this.getData("forecastGolCosts", partnerId, p => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...p}));
  }
}
