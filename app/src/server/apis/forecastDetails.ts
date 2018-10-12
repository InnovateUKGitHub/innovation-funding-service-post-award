import { ControllerBase } from "./controllerBase";
import { ForecastDetailsDTO } from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import {GetAllForecastsForPartnerQuery, GetForecastDetail} from "../features/forecastDetails";

export interface IForecastDetailsApi {
  getAllByPartnerId: (partnerId: string, periodId: number) => Promise<ForecastDetailsDTO[]>;
  get: (partnerId: string, periodId: number, costCategoryId: string) => Promise<ForecastDetailsDTO>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IForecastDetailsApi {

  constructor() {
    super("forecast-details");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10)}),
      (p) => this.getAllByPartnerId(p.partnerId, p.periodId)
    );

    this.getItem(
      "/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId}),
      (p) => this.get(p.partnerId, p.periodId, p.costCategoryId)
    );
  }

  public async getAllByPartnerId(partnerId: string, periodId: number) {
    const query = new GetAllForecastsForPartnerQuery(partnerId, periodId);
    return await contextProvider.start().runQuery(query);
  }

  public async get(partnerId: string, periodId: number, costCategoryId: string) {
    const query = new GetForecastDetail(partnerId, periodId, costCategoryId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
