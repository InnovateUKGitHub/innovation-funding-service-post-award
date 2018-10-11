import {getDataStoreItem} from "./data";
import {IDataSelector} from "./IDataSelector";
import {Pending} from "../../../shared/pending";
import {GOLCostDto} from "../../models";

export const forecastGolCostStore = "forecastGolCosts";

export const findGolCostsByPartner = (partnerId: string): IDataSelector<GOLCostDto[]> => ({
  key: partnerId,
  get: state => getDataStoreItem(state, forecastGolCostStore, partnerId),
  getPending: state => Pending.create(getDataStoreItem(state, forecastGolCostStore, partnerId))
});
