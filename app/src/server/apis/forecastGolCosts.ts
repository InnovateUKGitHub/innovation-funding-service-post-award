import { GOLCostDto } from "@framework/dtos/golCostDto";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims/getAllForecastGOLCostsQuery";
import { contextProvider } from "@server/features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IForecastGolCostsApi<Context extends "client" | "server"> {
  getAllByPartnerId: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<GOLCostDto[]>;
}

class Controller extends ControllerBase<"server", GOLCostDto> implements IForecastGolCostsApi<"server"> {
  constructor() {
    super("forecast-gol-costs");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => this.getAllByPartnerId(p),
    );
  }

  public async getAllByPartnerId(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const { partnerId } = params;
    const query = new GetAllForecastsGOLCostsQuery(partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
