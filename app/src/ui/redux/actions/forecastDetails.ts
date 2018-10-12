import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { findForecastDetailsByPartner } from "../selectors";

export function loadForecastDetailsForPartner(partnerId: string, periodId: number) {
  return conditionalLoad(
    findForecastDetailsByPartner(partnerId, periodId).key,
    "forecastDetails",
    () => ApiClient.forecastDetails.getAllByPartnerId(partnerId, periodId)
  );
}
