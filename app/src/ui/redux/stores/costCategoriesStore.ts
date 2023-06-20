import { LoadingStatus } from "@framework/constants/enums";
import { NotFoundError } from "@shared/appError";
import { Pending } from "@shared/pending";
import { apiClient } from "@ui/apiClient";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";
import { PartnersStore } from "./partnersStore";
import { StoreBase } from "./storeBase";
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
  public getAllForPartner(partnerId: PartnerId) {
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
  public getAllFiltered(partnerId: PartnerId) {
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
