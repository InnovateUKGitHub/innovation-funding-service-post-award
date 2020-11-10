import contextProvider from "@server/features/common/contextProvider";
import {
  GetAllForecastsForPartnerQuery,
  GetForecastDetailQuery,
  UpdateForecastDetailsCommand,
} from "@server/features/forecastDetails";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";
import { ForecastDetailsDTO } from "@framework/dtos";

export interface IForecastDetailsApi {
  getAllByPartnerId: (params: ApiParams<{ partnerId: string }>) => Promise<ForecastDetailsDTO[]>;
  get: (params: ApiParams<{partnerId: string, periodId: number, costCategoryId: string}>) => Promise<ForecastDetailsDTO>;
  update: (params: ApiParams<{projectId: string, partnerId: string, forecasts: ForecastDetailsDTO[], submit: boolean }>) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IForecastDetailsApi {
  constructor() {
    super("forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({ projectId: q.projectId, partnerId: q.partnerId, forecasts: processDto(b), submit: q.submit === "true" }),
      (p) => this.update(p)
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      (p) => this.getAllByPartnerId(p)
    );

    this.getItem(
      "/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId}),
      (p) => this.get(p)
    );
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>) {
    const query = new GetAllForecastsForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ partnerId: string, periodId: number, costCategoryId: string }>) {
    const query = new GetForecastDetailQuery(params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(params: ApiParams<{ projectId: string, partnerId: string, forecasts: ForecastDetailsDTO[], submit: boolean }>) {
    const context = contextProvider.start(params);
    const forecastCmd = new UpdateForecastDetailsCommand(params.projectId, params.partnerId, params.forecasts, params.submit);
    await context.runCommand(forecastCmd);

    return this.getAllByPartnerId({ partnerId: params.partnerId, user: params.user });
  }
}

export const controller = new Controller();
