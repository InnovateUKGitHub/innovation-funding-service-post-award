import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { GetForecastDetailQuery } from "@server/features/forecastDetails/getForecastDetailQuery";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails/updateForecastDetailsCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IForecastDetailsApi<Context extends "client" | "server"> {
  getAllByPartnerId: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<ForecastDetailsDTO[]>;
  get: (
    params: ApiParams<Context, { partnerId: PartnerId; periodId: number; costCategoryId: CostCategoryId }>,
  ) => Promise<ForecastDetailsDTO>;
  update: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; partnerId: PartnerId; forecasts: ForecastDetailsDTO[]; submit: boolean }
    >,
  ) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<"server", ForecastDetailsDTO> implements IForecastDetailsApi<"server"> {
  constructor() {
    super("forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        forecasts: processDto(b),
        submit: q.submit === "true",
      }),
      p => this.update(p),
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => this.getAllByPartnerId(p),
    );

    this.getItem(
      "/:partnerId/:periodId/:costCategoryId",
      p => ({ partnerId: p.partnerId, periodId: parseInt(p.periodId, 10), costCategoryId: p.costCategoryId }),
      p => this.get(p),
    );
  }

  public async getAllByPartnerId(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const query = new GetAllForecastsForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async get(
    params: ApiParams<"server", { partnerId: PartnerId; periodId: number; costCategoryId: CostCategoryId }>,
  ) {
    const query = new GetForecastDetailQuery(params.partnerId, params.periodId, params.costCategoryId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; partnerId: PartnerId; forecasts: ForecastDetailsDTO[]; submit: boolean }
    >,
  ) {
    const context = contextProvider.start(params);
    const forecastCmd = new UpdateForecastDetailsCommand(
      params.projectId,
      params.partnerId,
      params.forecasts,
      params.submit,
    );
    await context.runCommand(forecastCmd);

    return this.getAllByPartnerId({ partnerId: params.partnerId, user: params.user });
  }
}

export const controller = new Controller();
