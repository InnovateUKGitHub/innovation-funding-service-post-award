import { ControllerBase, ISession } from "./controllerBase";
import { ForecastDetailsDTO } from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import {GetAllForecastsForPartnerQuery, GetForecastDetail, UpdateForecastDetailsCommand} from "../features/forecastDetails";
import { processDto } from "../../shared/processResponse";

export interface IForecastDetailsApi {
  getAllByPartnerId: (params: {partnerId: string, periodId: number} & ISession) => Promise<ForecastDetailsDTO[]>;
  get: (params: {partnerId: string, periodId: number, costCategoryId: string} & ISession) => Promise<ForecastDetailsDTO>;
  update: (params: {partnerId: string, periodId: number, forecasts: ForecastDetailsDTO[]} & ISession) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IForecastDetailsApi {
  constructor() {
    super("forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), forecasts: processDto(b)}),
      (p) => this.update(p)
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10)}),
      (p) => this.getAllByPartnerId(p)
    );

    this.getItem(
      "/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId}),
      (p) => this.get(p)
    );
  }

  public async getAllByPartnerId(params: {partnerId: string, periodId: number} & ISession) {
    const {partnerId, periodId, user} = params;
    const query = new GetAllForecastsForPartnerQuery(partnerId, periodId);
    return await contextProvider.start(user).runQuery(query);
  }

  public async get(params: {partnerId: string, periodId: number, costCategoryId: string} & ISession) {
    const {partnerId, periodId, costCategoryId, user} = params;
    const query = new GetForecastDetail(partnerId, periodId, costCategoryId);
    return await contextProvider.start(user).runQuery(query);
  }

  public async update(params: {partnerId: string, periodId: number, forecasts: ForecastDetailsDTO[]} & ISession) {
    const {partnerId, periodId, forecasts, user} = params
    const command = new UpdateForecastDetailsCommand(partnerId, periodId, forecasts);
    await contextProvider.start(user).runCommand(command);

    return this.getAllByPartnerId({partnerId, periodId, user});
  }
}

export const controller = new Controller();
