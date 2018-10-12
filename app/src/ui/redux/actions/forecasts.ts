import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getForecastDetail } from "../selectors/forecastDetails";

export function loadForecastDetail(partnerId: string, periodId: number, costCategoryId: string) {
  return conditionalLoad(
    getForecastDetail(partnerId, periodId, costCategoryId).key,
    "forecastDetail",
    () => ApiClient.forecastDetails.get(partnerId, periodId, costCategoryId)
  );
}
