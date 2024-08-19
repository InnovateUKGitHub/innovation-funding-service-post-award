import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails/updateForecastDetailsCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IForecastDetailsApi<Context extends "client" | "server"> {
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
  }

  private async getAllByPartnerId(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const query = new GetAllForecastsForPartnerQuery(params.partnerId);
    return (await contextProvider.start(params)).runQuery(query);
  }

  public async update(
    params: ApiParams<
      "server",
      { projectId: ProjectId; partnerId: PartnerId; forecasts: ForecastDetailsDTO[]; submit: boolean }
    >,
  ) {
    const context = await contextProvider.start(params);
    const forecastCmd = new UpdateForecastDetailsCommand(
      params.projectId,
      params.partnerId,
      params.forecasts,
      params.submit,
    );
    await context.runCommand(forecastCmd);

    return this.getAllByPartnerId(params);
  }
}

export const controller = new Controller();
