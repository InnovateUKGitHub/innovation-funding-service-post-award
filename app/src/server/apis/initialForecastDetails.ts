import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { UpdateInitialForecastDetailsCommand } from "@server/features/forecastDetails/updateInitialForecastDetailsCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IInitialForecastDetailsApi<Context extends "client" | "server"> {
  getAllByPartnerId: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<ForecastDetailsDTO[]>;
  update: (
    params: ApiParams<
      Context,
      { projectId: ProjectId; partnerId: PartnerId; submit: boolean; forecasts: ForecastDetailsDTO[] }
    >,
  ) => Promise<ForecastDetailsDTO[]>;
}

class Controller extends ControllerBase<"server", ForecastDetailsDTO> implements IInitialForecastDetailsApi<"server"> {
  constructor() {
    super("initial-forecast-details");

    this.putItems(
      "/",
      (p, q, b) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        submit: q.submit === "true",
        forecasts: processDto(b),
      }),
      p => this.update(p),
    );

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => this.getAllByPartnerId(p),
    );
  }

  public async getAllByPartnerId(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const query = new GetAllInitialForecastsForPartnerQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; partnerId: PartnerId; submit: boolean; forecasts: ForecastDetailsDTO[] }
    >,
  ) {
    const context = contextProvider.start(params);
    const forecastCmd = new UpdateInitialForecastDetailsCommand(
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
