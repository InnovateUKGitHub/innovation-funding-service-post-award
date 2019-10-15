import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";

export class CostCategoriesStore extends StoreBase {

  public getAll() {
    return this.getData("costCategories", "all", p => ApiClient.costCategories.getAll(p));
  }
}
