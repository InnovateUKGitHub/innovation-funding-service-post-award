import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { RootState } from "../reducers";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { getCostCategories } from "./costCategories";
import { findClaimDetailsByPartner } from "./claims";

export const forecastDetailsStore = "forecastDetails";
export const findForecastDetailsByPartner = (partnerId: string, periodId: number) => dataStoreHelper(forecastDetailsStore, getKey(partnerId, periodId));

const forecastDetailStore = "forecastDetail";
export const getForecastDetail = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(forecastDetailStore, getKey(partnerId, periodId, costCategoryId));

const createValidator = (partnerId: string, periodId: number, forecastDetails: ForecastDetailsDTO[], store: RootState) => {
  // TODO - revist get vs getPending
  const claimDetails   = findClaimDetailsByPartner(partnerId).getPending(store).data || [];
  const golCosts       = findGolCostsByPartner(partnerId).getPending(store).data || [];
  const costCategories = getCostCategories().getPending(store).data || [];
  return new ForecastDetailsDtosValidator(periodId, forecastDetails, claimDetails, golCosts, costCategories, false);
};

export const getForecastDetailsEditor = (partnerId: string, periodId: number) => editorStoreHelper<ForecastDetailsDTO[], ForecastDetailsDtosValidator>(
  forecastDetailsStore,
  x => x.forecastDetails,
  store => findForecastDetailsByPartner(partnerId, periodId).getPending(store),
  (forecasts, store) => createValidator(partnerId, periodId, forecasts, store),
  getKey(partnerId, periodId)
);

export const forecastGolCostStore = "forecastGolCosts";
export const findGolCostsByPartner = (partnerId: string) => dataStoreHelper(forecastGolCostStore, partnerId);
