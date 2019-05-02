import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { RootState } from "../reducers";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { findClaimDetailsByPartner, findClaimsByPartner } from "./claims";

export const forecastDetailsStore = "forecastDetails";
export const findForecastDetailsByPartner = (partnerId: string) => dataStoreHelper(forecastDetailsStore, partnerId);

const forecastDetailStore = "forecastDetail";
export const getForecastDetail = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(forecastDetailStore, getKey(partnerId, periodId, costCategoryId));

const createValidator = (partnerId: string, forecastDetails: ForecastDetailsDTO[], store: RootState) => {
  // TODO - revist get vs getPending
  const claims = findClaimsByPartner(partnerId).getPending(store).data || [];
  const claimDetails   = findClaimDetailsByPartner(partnerId).getPending(store).data || [];
  const golCosts       = findGolCostsByPartner(partnerId).getPending(store).data || [];
  return new ForecastDetailsDtosValidator(forecastDetails, claims, claimDetails, golCosts, false);
};

export const getForecastDetailsEditor = (partnerId: string) => {
  return editorStoreHelper<ForecastDetailsDTO[], ForecastDetailsDtosValidator>(
    forecastDetailsStore,
    x => x.forecastDetails,
    store => findForecastDetailsByPartner(partnerId).getPending(store),
    (forecasts, store) => createValidator(partnerId, forecasts, store),
    getKey("partner", partnerId)
  );
};

export const forecastGolCostStore = "forecastGolCosts";
export const findGolCostsByPartner = (partnerId: string) => dataStoreHelper(forecastGolCostStore, partnerId);
