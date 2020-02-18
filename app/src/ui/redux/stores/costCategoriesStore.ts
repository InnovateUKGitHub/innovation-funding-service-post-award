import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { NotFoundError } from "@server/features/common";
import { RootState } from "../reducers";
import { RootActionsOrThunk } from "../actions/root";
import { PartnersStore } from "./partnersStore";

export class CostCategoriesStore extends StoreBase {
  constructor(private partnerStore: PartnersStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  public getAllForPartner(partnerId: string) {
    const competitionType = this.partnerStore.getById(partnerId).then(x => x.competitionType);
    const organisationType = this.partnerStore.getById(partnerId).then(x => x.organisationType);
    const costCategories = this.getAll();

    return Pending.combine({
      competitionType,
      organisationType,
      costCategories
    })
    .then(combined => (
      combined.costCategories.filter(costCategory => costCategory.competitionType === combined.competitionType && costCategory.organisationType === combined.organisationType)
    ));
  }

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
