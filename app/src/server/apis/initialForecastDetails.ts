import contextProvider from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails";

export interface IInitialForecastDetailsApi {
  getAllByPartnerId: (params: ApiParams<{ partnerId: string }>) => Promise<ForecastDetailsDTO[]>;
  update: (params: ApiParams<{projectId: string, partnerId: string, forecasts: ForecastDetailsDTO[] }>) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<ForecastDetailsDTO> implements IInitialForecastDetailsApi {
  constructor() {
    super("initial-forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({ projectId: q.projectId, partnerId: q.partnerId, forecasts: processDto(b) }),
      (p) => this.update(p)
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      (p) => this.getAllByPartnerId(p)
    );
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>) {
    const query = new GetAllInitialForecastsForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(params: ApiParams<{ projectId: string, partnerId: string, forecasts: ForecastDetailsDTO[] }>) {
    const context = contextProvider.start(params);
    const forecastCmd = new UpdateInitialForecastDetailsCommand(params.projectId, params.partnerId, params.forecasts);
    await context.runCommand(forecastCmd);

    return this.getAllByPartnerId({ partnerId: params.partnerId, user: params.user });
  }
}

export const controller = new Controller();
