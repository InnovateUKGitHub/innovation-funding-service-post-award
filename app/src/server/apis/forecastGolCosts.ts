import { ControllerBase, ISession } from "./controllerBase";
import { GOLCostDto } from "../../ui/models";
import { GetAllForecastsGOLCostsQuery } from "../features/claims/getAllForecastGOLCostsQuery";
import contextProvider from "../features/common/contextProvider";

export interface IForecastGolCostsApi {
  getAllByPartnerId: (params: {partnerId: string} & ISession) => Promise<GOLCostDto[]>;
}

class Controller extends ControllerBase<GOLCostDto> implements IForecastGolCostsApi {
  constructor() {
    super("forecast-gol-costs");

    this.getItems(
      "/",
      (p, q) => ({ partnerId: q.partnerId }),
      (p) => this.getAllByPartnerId(p)
    );
  }

  public async getAllByPartnerId(params: {partnerId: string} & ISession) {
    const {partnerId, user} = params;
    const query = new GetAllForecastsGOLCostsQuery(partnerId);
    return await contextProvider.start(user).runQuery(query);
  }
}

export const controller = new Controller();
