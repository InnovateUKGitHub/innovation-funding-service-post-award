import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { costCategoriesStore, getCostCategories } from "../selectors/costCategories";

export function loadCostCategories() {
  return conditionalLoad(
    getCostCategories().key,
    costCategoriesStore,
    (params) => ApiClient.costCategories.getAll(params)
  );
}
