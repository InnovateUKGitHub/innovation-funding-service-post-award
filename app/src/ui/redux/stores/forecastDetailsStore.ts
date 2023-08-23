import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnersStore } from "@ui/redux/stores/partnersStore";
import { InitialForecastDetailsDtosValidator } from "@ui/validation/validators/initialForecastDetailsDtosValidator";
import { CostCategoriesStore } from "@ui/redux/stores/costCategoriesStore";
import { ForecastGolCostsStore } from "./forecastGolCostsStore";
import { ClaimsDetailsStore } from "./claimDetailsStore";
import { ClaimsStore } from "./claimsStore";
import { StoreBase } from "./storeBase";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { messageSuccess } from "../actions/common/messageActions";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

export class ForecastDetailsStore extends StoreBase {
  constructor(
    private readonly claimsStore: ClaimsStore,
    private readonly claimDetailsStore: ClaimsDetailsStore,
    private readonly golCostsStore: ForecastGolCostsStore,
    private readonly partnersStore: PartnersStore,
    private readonly costCategoriesStore: CostCategoriesStore,
    getState: () => RootState,
    queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  public get(partnerId: PartnerId, periodId: number, costCategoryId: CostCategoryId) {
    return this.getData("forecastDetail", storeKeys.getForecastDetailKey(partnerId, periodId, costCategoryId), p =>
      apiClient.forecastDetails.get({ partnerId, periodId, costCategoryId, ...p }),
    );
  }

  public getAllByPartner(partnerId: PartnerId) {
    return this.getData("forecastDetails", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.forecastDetails.getAllByPartnerId({ partnerId, ...p }),
    );
  }

  public getAllInitialByPartner(partnerId: PartnerId) {
    return this.getData("initialForecastDetails", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.initialForecastDetails.getAllByPartnerId({ partnerId, ...p }),
    );
  }

  private getValidator(partnerId: PartnerId, dto: ForecastDetailsDTO[], showValidationErrors: boolean) {
    const combined = Pending.combine({
      claims: this.claimsStore.getAllClaimsForPartner(partnerId),
      claimDetails: this.claimDetailsStore.getAllByPartner(partnerId),
      golCosts: this.golCostsStore.getAllByPartner(partnerId),
      partner: this.partnersStore.getById(partnerId),
    });

    return combined.then(
      x => new ForecastDetailsDtosValidator(dto, x.claims, x.claimDetails, x.golCosts, x.partner, showValidationErrors),
    );
  }

  private getInitialValidator(
    partnerId: PartnerId,
    dto: ForecastDetailsDTO[],
    submit: boolean,
    showValidationErrors: boolean,
  ) {
    const combined = Pending.combine({
      costCategories: this.costCategoriesStore.getAllForPartner(partnerId),
      colCosts: this.golCostsStore.getAllByPartner(partnerId),
    });

    return combined.then(
      x => new InitialForecastDetailsDtosValidator(dto, x.colCosts, x.costCategories, submit, showValidationErrors),
    );
  }

  public getForecastEditor(partnerId: PartnerId, init?: (data: ForecastDetailsDTO[]) => void) {
    return this.getEditor(
      "forecastDetails",
      storeKeys.getPartnerKey(partnerId),
      () => this.getAllByPartner(partnerId),
      init,
      dto => this.getValidator(partnerId, dto, false),
    );
  }

  public getInitialForecastEditor(partnerId: PartnerId, init?: (data: ForecastDetailsDTO[]) => void) {
    return this.getEditor(
      "initialForecastDetails",
      storeKeys.getPartnerKey(partnerId),
      () => this.getAllInitialByPartner(partnerId),
      init,
      dto => this.getInitialValidator(partnerId, dto, false, false),
    );
  }

  public updateForecastEditor(
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    dtos: ForecastDetailsDTO[],
    submitClaim: boolean,
    message?: string,
    onComplete?: () => void,
  ) {
    super.updateEditor(
      saving,
      "forecastDetails",
      storeKeys.getPartnerKey(partnerId),
      dtos,
      show => this.getValidator(partnerId, dtos, show),
      p => apiClient.forecastDetails.update({ ...p, projectId, partnerId, submit: submitClaim, forecasts: dtos }),
      () => this.handleError(message, onComplete),
    );
  }

  public updateInitialForecastEditor(
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    payload: ForecastDetailsDTO[],
    submit: boolean,
    message?: string,
    onComplete?: () => void,
  ) {
    super.updateEditor(
      saving,
      "initialForecastDetails",
      storeKeys.getPartnerKey(partnerId),
      payload,
      show => this.getInitialValidator(partnerId, payload, submit, show),
      p => apiClient.initialForecastDetails.update({ ...p, projectId, partnerId, submit, forecasts: payload }),
      () => this.handleError(message, onComplete),
    );
  }

  private handleError(message?: string, onComplete?: () => void): void {
    if (message) this.queue(messageSuccess(message));

    onComplete?.();
  }
}
