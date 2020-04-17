import contextProvider from "../features/common/contextProvider";
import {ApiParams, ControllerBase} from "./controllerBase";
import {GetCostCategoriesQuery} from "../features/claims";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export interface ICostCategoriesApi {
  getAll: (params: ApiParams<{}>) => Promise<CostCategoryDto[]>;
}

class Controller extends ControllerBase<CostCategoryDto> implements ICostCategoriesApi {

  constructor() {
    super("cost-categories");
    this.getItems("/", p => ({}),  (p) => this.getAll(p));
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetCostCategoriesQuery();
    return contextProvider.start(params).runQuery(query);
  }

}

export const controller = new Controller();
