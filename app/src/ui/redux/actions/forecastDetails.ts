import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import {findForecastDetailsByPartner, getForecastDetail} from "../selectors";

export function loadForecastDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findForecastDetailsByPartner(partnerId, periodId).key,
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
