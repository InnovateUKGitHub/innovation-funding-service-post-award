import {conditionalLoad} from "./common";
import {ApiClient} from "../../apiClient";
import { getCostCategories } from "../selectors/costCategories";

export function loadCostCategories() {
  const selector = getCostCategories();
  return conditionalLoad(selector.key, selector.store, params => ApiClient.costCategories.getAll(params));
}
