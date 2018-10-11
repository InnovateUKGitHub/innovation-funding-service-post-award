import {getDataStoreItem} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";
import {ForecastDetailsDTO} from "../../models";

export const forecastDetailsStore = "forecastDetails";
const key = (partnerId: string, periodId: number) => partnerId + "_" + periodId;

export const findForecastDetailsByPartner = (partnerId: string, periodId: number): IDataSelector<ForecastDetailsDTO[]> => ({
  key: key(partnerId, periodId),
  get: state => getDataStoreItem(state, forecastDetailsStore, key(partnerId, periodId)),
  getPending: state => Pending.create(getDataStoreItem(state, forecastDetailsStore, key(partnerId, periodId)))
});
