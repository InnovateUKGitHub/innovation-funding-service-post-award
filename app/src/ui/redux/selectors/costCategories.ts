import { CostCategoryDto } from "../../models";
import { dataStoreHelper, IDataSelector } from "./common";

export const costCategoriesStore = "costCategories";
export const getCostCategories = () => dataStoreHelper(costCategoriesStore, "All") as IDataSelector<CostCategoryDto[]>;
