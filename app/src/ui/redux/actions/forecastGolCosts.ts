import {conditionalLoad} from "./dataLoad";
import { ApiClient } from "../../apiClient";
import { findGolCostsByPartner } from "../selectors";

export function loadForecastGOLCostsForPartner(partnerId: string) {
  return conditionalLoad(
    findGolCostsByPartner(partnerId).key,
    "forecastGolCosts",
    (params) => ApiClient.forecastGolCosts.getAllByPartnerId({partnerId, ...params})
  );
}
