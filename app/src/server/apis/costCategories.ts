import contextProvider from "../features/common/contextProvider";
import {ControllerBase, ISession} from "./controllerBase";
import {CostCategoryDto} from "../../ui/models/costCategoryDto";
import {GetCostCategoriesQuery} from "../features/claims";

export interface ICostCategoriesApi {
  getAll: (params: ISession) => Promise<CostCategoryDto[]>;
}

class Controller extends ControllerBase<CostCategoryDto> implements ICostCategoriesApi {

  constructor() {
    super("cost-categories");
    this.getItems("/", p => ({}),  (p) => this.getAll(p));
  }

  public async getAll(params: ISession) {
    const query = new GetCostCategoriesQuery();
    return await contextProvider.start(params.user).runQuery(query);
  }

}

export const controller = new Controller();
