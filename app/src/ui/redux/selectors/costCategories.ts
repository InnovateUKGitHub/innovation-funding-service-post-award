import { dataStoreHelper } from "./common";

export const costCategoriesStore = "costCategories";
export const getCostCategories = () => dataStoreHelper(costCategoriesStore, "All");
