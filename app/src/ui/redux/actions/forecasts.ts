import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getForecastDetail } from "../selectors/forecastDetails";

export function loadForecastDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    partnerId + "_" + periodId,
    "forecastDetails",
    () => ApiClient.forecastDetails.getAllByPartnerId(partnerId, periodId)
  );
}

export function loadForecastDetail(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getForecastDetail(partnerId, periodId, costCategoryId).key,
    "forecastDetail",
    () => ApiClient.forecastDetails.get(partnerId, periodId, costCategoryId)
  );
}

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return conditionalLoad(
    partnerId,
    "forecastGolCosts",
    () => ApiClient.forecastGolCosts.getAllByPartnerId(partnerId)
  );
}
