import { ControllerBase } from "./controllerBase";
import { ForecastDetailsDTO } from "../../ui/models";
import { GetAllForecastsForPartnerQuery } from "../features/claims/getAllForecastsForPartnerQuery";
import contextProvider from "../features/common/contextProvider";

export interface IForecastDetailsApi {
  getAllByPartnerId: (partnerId: string, periodId: number) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IForecastDetailsApi {

  constructor() {
    super("forecast-details");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10)}),
      (p) => this.getAllByPartnerId(p.partnerId, p.periodId)
    );
  }

  public async getAllByPartnerId(partnerId: string, periodId: number) {
    const query = new GetAllForecastsForPartnerQuery(partnerId, periodId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
