import {getDataStoreItem} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";
import {ForecastDetailsDTO} from "../../models";

export const forecastDetailsStore = "forecastDetails";

export const findForecastDetailsByPartner = (partnerId: string, periodId: number): IDataSelector<ForecastDetailsDTO[]> => {
  const key = partnerId + "_" + periodId;
  return {
    key,
    get: state => getDataStoreItem(state, forecastDetailsStore, key),
    getPending: state => Pending.create(getDataStoreItem(state, forecastDetailsStore, key))
  };
};

const forecastDetailStore = "forecastDetail";
export const getForecastDetail = (partnerId: string, periodId: number, costCategoryId: string): IDataSelector<ForecastDetailsDTO> => {
  const key = partnerId + "_" + periodId + "_" + costCategoryId;
  return {
    key,
    get: state => getDataStoreItem(state, forecastDetailStore, key),
    getPending: state => Pending.create(getDataStoreItem(state, forecastDetailStore, key))
  };
};
