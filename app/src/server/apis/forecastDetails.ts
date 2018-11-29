import { ApiParams, ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import {GetAllForecastsForPartnerQuery, GetForecastDetail, UpdateForecastDetailsCommand} from "../features/forecastDetails";
import { GetClaim } from "../features/claims";
import { processDto } from "../../shared/processResponse";
import { UpdateClaimCommand } from "../features/claims/updateClaim";
import { ClaimStatus } from "../../types";

export interface IForecastDetailsApi {
  getAllByPartnerId: (params: ApiParams<{partnerId: string, periodId: number }>) => Promise<ForecastDetailsDTO[]>;
  get: (params: ApiParams<{partnerId: string, periodId: number, costCategoryId: string }>) => Promise<ForecastDetailsDTO>;
  update: (params: ApiParams<{partnerId: string, periodId: number, forecasts: ForecastDetailsDTO[], submit: boolean }>) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IForecastDetailsApi {
  constructor() {
    super("forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({ partnerId: q.partnerId, periodId: parseInt(q.periodId, 10), forecasts: processDto(b), submit: q.submit === "true"}),
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

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string, periodId: number }>) {
    const query = new GetAllForecastsForPartnerQuery(params.partnerId, params.periodId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) {
    const query = new GetForecastDetail(params.partnerId, params.periodId, params.costCategoryId);
    return await contextProvider.start(params).runQuery(query);
  }

  public async update(params: ApiParams<{ partnerId: string, periodId: number, forecasts: ForecastDetailsDTO[], submit: boolean }>) {
    const context = contextProvider.start(params);
    const forecastCmd = new UpdateForecastDetailsCommand(params.partnerId, params.periodId, params.forecasts, params.submit);
    await context.runCommand(forecastCmd);

    return this.getAllByPartnerId({ partnerId: params.partnerId, periodId: params.periodId, user: params.user });
  }
}

export const controller = new Controller();
