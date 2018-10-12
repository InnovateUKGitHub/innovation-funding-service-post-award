import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";

export function loadForecastDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    partnerId + "_" + periodId,
    "forecastDetails",
    () => ApiClient.forecastDetails.getAllByPartnerId(partnerId, periodId)
  );
}

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return conditionalLoad(
    partnerId,
    "forecastGolCosts",
    () => ApiClient.forecastGolCosts.getAllByPartnerId(partnerId)
  );
}
