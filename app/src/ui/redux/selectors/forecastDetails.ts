import { RootState } from "@ui/redux/reducers";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { getKey } from "@framework/util/key";
import { dataStoreHelper, editorStoreHelper } from "./common";
import { findClaimDetailsByPartner, findClaimsByPartner } from "./claims";
import { Pending } from "@shared/pending";

export const forecastDetailsStore = "forecastDetails";
export const findForecastDetailsByPartner = (partnerId: string) => dataStoreHelper(forecastDetailsStore, partnerId);

const forecastDetailStore = "forecastDetail";
export const getForecastDetail = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(forecastDetailStore, getKey(partnerId, periodId, costCategoryId));

const createValidator = (partnerId: string, forecastDetails: ForecastDetailsDTO[], store: RootState) => {
  const claims = findClaimsByPartner(partnerId).getPending(store);
  const claimDetails = findClaimDetailsByPartner(partnerId).getPending(store);
  const golCosts = findGolCostsByPartner(partnerId).getPending(store);

  return Pending.combine({
    claims,
    claimDetails,
    golCosts
  }).then(x => new ForecastDetailsDtosValidator(forecastDetails, x.claims, x.claimDetails, x.golCosts, false));
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
