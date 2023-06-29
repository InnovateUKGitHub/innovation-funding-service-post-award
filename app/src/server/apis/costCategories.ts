import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  GetUnfilteredCostCategoriesQuery,
  GetFilteredCostCategoriesQuery,
} from "@server/features/claims/getCostCategoriesQuery";
import { contextProvider } from "../features/common/contextProvider";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface ICostCategoriesApi<Context extends "client" | "server"> {
  getAll: (params: ApiParams<Context>) => Promise<CostCategoryDto[]>;
  getAllFiltered: (params: ApiParams<Context, { partnerId: PartnerId }>) => Promise<CostCategoryDto[]>;
}

class Controller extends ControllerBase<"server", CostCategoryDto> implements ICostCategoriesApi<"server"> {
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

  public async getAll(params: ApiParams<"server">) {
    const query = new GetUnfilteredCostCategoriesQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async getAllFiltered(params: ApiParams<"server", { partnerId: PartnerId }>) {
    const query = new GetFilteredCostCategoriesQuery(params.partnerId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
