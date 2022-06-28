import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { NotFoundError } from "@server/features/common";
import { LoadingStatus } from "@framework/constants";
import { RootState } from "../reducers";
import { RootActionsOrThunk } from "../actions/root";
import { StoreBase } from "./storeBase";
import { PartnersStore } from "./partnersStore";
import { storeKeys } from "./storeKeys";

export class CostCategoriesStore extends StoreBase {
  constructor(
    private readonly partnerStore: PartnersStore,
    getState: () => RootState,
    queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  /**
   * @todo deprecate this api in favour of getAllFiltered()
   */
  public getAllForPartner(partnerId: string) {
    const competitionType = this.partnerStore.getById(partnerId).then(x => x.competitionType);
    const organisationType = this.partnerStore.getById(partnerId).then(x => x.organisationType);
    const costCategories = this.getAllFiltered(partnerId);

    return Pending.combine({
      competitionType,
      organisationType,
      costCategories,
    }).then(res =>
      res.costCategories.filter(
        x => x.competitionType === res.competitionType && x.organisationType === res.organisationType,
      ),
    );
  }

  public getAllUnfiltered() {
    return this.getData("costCategories", "all", p => apiClient.costCategories.getAll(p));
  }

  /**
   * @todo Add support for filtering (competitionType, organisationType)
   */
  public getAllFiltered(partnerId: string) {
    return this.getData("costCategories", storeKeys.getCostCategoryKey(partnerId), p =>
      apiClient.costCategories.getAllFiltered({ ...p, partnerId }),
    );
  }

  public get(costCategoryId: string) {
    return this.getAllUnfiltered().chain(costCategories => {
      const result = costCategories.find(costCategory => costCategory.id === costCategoryId);
      return new Pending(
        result ? LoadingStatus.Done : LoadingStatus.Failed,
        result,
        result ? null : new NotFoundError("Could not find costcategory"),
      );
    });
  }
}
