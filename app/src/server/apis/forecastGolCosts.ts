import { GOLCostDto } from "@framework/dtos";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims/getAllForecastGOLCostsQuery";
import { contextProvider } from "@server/features/common/contextProvider";

export interface IForecastGolCostsApi {
  getAllByPartnerId: (params: ApiParams<{ partnerId: string }>) => Promise<GOLCostDto[]>;
}

class Controller extends ControllerBase<GOLCostDto> implements IForecastGolCostsApi {
  constructor() {
    super("forecast-gol-costs");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      p => this.getAllByPartnerId(p),
    );
  }

  public async getAllByPartnerId(params: ApiParams<{ partnerId: string }>) {
    const { partnerId } = params;
    const query = new GetAllForecastsGOLCostsQuery(partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
