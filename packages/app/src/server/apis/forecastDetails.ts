import { ForecastDetailsDTO, ForecastUpdateDto } from "@framework/dtos/forecastDetailsDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";
import { UpdateForecastCommand } from "@server/features/forecastDetails/updateForecastCommand";

export interface IForecastDetailsApi<Context extends "client" | "server"> {
  updateForecast: (
    params: ApiParams<Context, { projectId: ProjectId; partnerId: PartnerId; forecast: ForecastUpdateDto }>,
  ) => Promise<boolean>;
}

class Controller extends ControllerBase<"server", ForecastDetailsDTO> implements IForecastDetailsApi<"server"> {
  constructor() {
    super("forecast-details");

    this.putItem(
      "/:projectId/:partnerId/update-forecast",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        forecast: processDto(b),
      }),
      p => this.updateForecast(p),
    );
  }

  public async updateForecast(
    params: ApiParams<"server", { projectId: ProjectId; partnerId: PartnerId; forecast: ForecastUpdateDto }>,
  ) {
    const context = await contextProvider.start(params);

    const forecastCmd = new UpdateForecastCommand(params.projectId, params.partnerId, params.forecast);
    await context.runCommand(forecastCmd);

    return true;
  }
}

export const controller = new Controller();
