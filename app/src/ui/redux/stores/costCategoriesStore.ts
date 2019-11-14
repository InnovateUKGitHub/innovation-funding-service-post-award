import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { NotFoundError } from "@server/features/common";

export class CostCategoriesStore extends StoreBase {

  public getAll() {
    return this.getData("costCategories", "all", p => ApiClient.costCategories.getAll(p));
  }

  public get(costCategoryId: string) {
    return this.getAll().chain(costCategories => {
      const result = costCategories.find(costCategory => costCategory.id === costCategoryId);
      return new Pending(result ? LoadingStatus.Done : LoadingStatus.Failed, result, result ? null : new NotFoundError("Could not find costcategory"));
    });
  }
}
