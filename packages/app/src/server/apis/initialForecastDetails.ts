import { InitialForecastDto } from "@framework/dtos/forecastDetailsDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";
import { UpdateInitialForecastCommand } from "@server/features/forecastDetails/updateInititalForecastCommand";

export interface IInitialForecastDetailsApi<Context extends "client" | "server"> {
  update: (
    params: ApiParams<Context, { projectId: ProjectId; partnerId: PartnerId; forecasts: InitialForecastDto }>,
  ) => Promise<boolean>;
}

class Controller extends ControllerBase<"server", boolean> implements IInitialForecastDetailsApi<"server"> {
  constructor() {
    super("initial-forecast-details");

    this.putItem(
      "/",
      (p, q, b) => ({
        projectId: q.projectId,
        partnerId: q.partnerId,
        forecasts: processDto(b),
      }),
      p => this.update(p),
    );
  }

  public async update(
    params: ApiParams<"server", { projectId: ProjectId; partnerId: PartnerId; forecasts: InitialForecastDto }>,
  ) {
    const context = await contextProvider.start(params);
    const forecastCmd = new UpdateInitialForecastCommand(params.projectId, params.partnerId, params.forecasts);
    await context.runCommand(forecastCmd);

    return true;
  }
}

export const controller = new Controller();
