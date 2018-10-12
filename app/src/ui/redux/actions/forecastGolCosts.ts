import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { findGolCostsByPartner } from "../selectors";

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return conditionalLoad(
    findGolCostsByPartner(partnerId).key,
    "forecastGolCosts",
    () => ApiClient.forecastGolCosts.getAllByPartnerId(partnerId)
  );
}
