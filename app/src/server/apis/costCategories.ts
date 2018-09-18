import contextProvider from "../features/common/contextProvider";
import { ControllerBase } from "./controllerBase";
import { CostCategoryDto } from "../../ui/models/costCategoryDto";
import { GetCostCategoriesQuery } from "../features/claims/getCostCategoriesQuery";

export interface ICostCategoriesApi {
    getAll: () => Promise<CostCategoryDto[]>;
}

class Controller extends ControllerBase<CostCategoryDto> implements ICostCategoriesApi {
    constructor() {
        super();

        this.getItems("/", p => ({}), (p) => this.getAll());
    }

    public async getAll() {
        const query = new GetCostCategoriesQuery();
        return await contextProvider.start().runQuery(query);
    }

}

export const controller = new Controller();
