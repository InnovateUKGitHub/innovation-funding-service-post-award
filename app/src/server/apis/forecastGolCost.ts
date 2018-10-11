import { ControllerBase } from "./controllerBase";
import { GOLCostDto } from "../../ui/models";
import { GetAllForecastsGOLCostsQuery } from "../features/claims/getAllForecastGOLCostsQuery";
import contextProvider from "../features/common/contextProvider";

export interface IForecastGolCostsApi {
  getAllByPartnerId: (partnerId: string) => Promise<GOLCostDto[]>;
}

class Controller extends ControllerBase<GOLCostDto> implements IForecastGolCostsApi {
  constructor() {
    super("forecasts-gol-costs");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      (p) => this.getAllByPartnerId(p.partnerId)
    );
  }

  public async getAllByPartnerId(partnerId: string) {
    const query = new GetAllForecastsGOLCostsQuery(partnerId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
