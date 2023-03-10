import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { contextProvider } from "../features/common/contextProvider";
import { GetUnfilteredCostCategoriesQuery, GetFilteredCostCategoriesQuery } from "../features/claims";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface ICostCategoriesApi {
  getAll: (params: ApiParams) => Promise<CostCategoryDto[]>;
  getAllFiltered: (params: ApiParams<{ partnerId: string }>) => Promise<CostCategoryDto[]>;
}

class Controller extends ControllerBase<CostCategoryDto> implements ICostCategoriesApi {
  constructor() {
    super("cost-categories");
    this.getItems(
      "/",
      () => ({}),
      p => this.getAll(p),
    );
    this.getItems(
      "/filtered/:partnerId",
      p => ({ partnerId: p.partnerId }),
      p => this.getAllFiltered(p),
    );
  }

  public async getAll(params: ApiParams) {
    const query = new GetUnfilteredCostCategoriesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllFiltered(params: ApiParams<{ partnerId: string }>) {
    const query = new GetFilteredCostCategoriesQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
