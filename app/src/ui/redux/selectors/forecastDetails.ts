import { dataStoreHelper, getDataStoreItem } from "./data";
import { IDataSelector } from "./IDataSelector";
import { Pending } from "../../../shared/pending";
import { ForecastDetailsDTO } from "../../models";
import { editorStoreHelper } from "./claim";
import { getKey } from "../../../util/key";
import { RootState } from "../reducers";
import { ForecastDetailsDtosValidator } from "../../validators/forecastDetailsDtosValidator";
import { findClaimDetailsByPartner } from "./claimDetails";
import { findGolCostsByPartner } from "./forecastGolCosts";
import { getCostCategories } from "./costCategories";

export const forecastDetailsStore = "forecastDetails";

export const findForecastDetailsByPartner = (partnerId: string, periodId: number) => dataStoreHelper(forecastDetailsStore, getKey(partnerId, periodId)) as IDataSelector<ForecastDetailsDTO[]>;

const forecastDetailStore = "forecastDetail";
export const getForecastDetail = (partnerId: string, periodId: number, costCategoryId: string): IDataSelector<ForecastDetailsDTO> => {
  const key = partnerId + "_" + periodId + "_" + costCategoryId;
  return {
    key,
    get: state => getDataStoreItem(state, forecastDetailStore, key),
    getPending: state => Pending.create(getDataStoreItem(state, forecastDetailStore, key))
  };
};

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
