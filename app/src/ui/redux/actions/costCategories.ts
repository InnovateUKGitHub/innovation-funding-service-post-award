import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getCostCategories } from "../selectors/costCategories";

export function loadCostCategories() {
  return conditionalLoad(getCostCategories(), params => ApiClient.costCategories.getAll(params));
}
