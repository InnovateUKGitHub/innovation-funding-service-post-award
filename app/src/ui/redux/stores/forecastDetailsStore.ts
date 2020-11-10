import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { ClaimsStore } from "./claimsStore";
import { ClaimsDetailsStore } from "./claimDetailsStore";
import { ForecastGolCostsStore } from "./forecastGolCostsStore";
import { RootState } from "@ui/redux";
import { messageSuccess, RootActionsOrThunk } from "@ui/redux/actions";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnersStore } from "@ui/redux/stores/partnersStore";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";
import { CostCategoriesStore } from "@ui/redux/stores/costCategoriesStore";
import { ForecastDetailsDTO } from "@framework/dtos";

export class ForecastDetailsStore extends StoreBase {
  constructor(
    private readonly claimsStore: ClaimsStore,
    private readonly claimDetailsStore: ClaimsDetailsStore,
    private readonly golCostsStore: ForecastGolCostsStore,
    private readonly partnersStore: PartnersStore,
    private readonly costCategoriesStore: CostCategoriesStore,
    getState: () => RootState, queue: (action: RootActionsOrThunk) => void
  ) {
    super(getState, queue);
  }

  public get(partnerId: string, periodId: number, costCategoryId: string) {
    return this.getData("forecastDetail", storeKeys.getForecastDetailKey(partnerId, periodId, costCategoryId), p => ApiClient.forecastDetails.get({partnerId, periodId, costCategoryId, ...p}));
  }

  public getAllByPartner(partnerId: string) {
    return this.getData("forecastDetails", storeKeys.getPartnerKey(partnerId), p => ApiClient.forecastDetails.getAllByPartnerId({ partnerId, ...p }));
  }

  public getAllInitialByPartner(partnerId: string) {
    return this.getData("initialForecastDetails", storeKeys.getPartnerKey(partnerId), p => ApiClient.initialForecastDetails.getAllByPartnerId({ partnerId, ...p }));
  }

  private getValidator(partnerId: string, dto: ForecastDetailsDTO[], showValidationErrors: boolean) {
    const combined = Pending.combine({
      claims: this.claimsStore.getAllClaimsForPartner(partnerId),
      claimDetails: this.claimDetailsStore.getAllByPartner(partnerId),
      golCosts: this.golCostsStore.getAllByPartner(partnerId),
      partner: this.partnersStore.getById(partnerId)
    });
    return combined.then(x => new ForecastDetailsDtosValidator(dto, x.claims, x.claimDetails, x.golCosts, x.partner, showValidationErrors));
  }

  private getInitialValidator(partnerId: string, dto: ForecastDetailsDTO[], submit: boolean, showValidationErrors: boolean) {
    const combined = Pending.combine({
      costCategories: this.costCategoriesStore.getAllForPartner(partnerId),
      colCosts: this.golCostsStore.getAllByPartner(partnerId),
    });
    return combined.then(x => new InitialForecastDetailsDtosValidator(dto, x.colCosts, x.costCategories, submit, showValidationErrors));
  }

  public getForecastEditor(partnerId: string, init?: (data: ForecastDetailsDTO[]) => void) {
    return this.getEditor(
      "forecastDetails",
      storeKeys.getPartnerKey(partnerId),
      () => this.getAllByPartner(partnerId),
      init,
      (dto) => this.getValidator(partnerId, dto, false)
    );
  }

  public getInitialForecastEditor(partnerId: string, init?: (data: ForecastDetailsDTO[]) => void) {
    return this.getEditor(
      "initialForecastDetails",
      storeKeys.getPartnerKey(partnerId),
      () => this.getAllInitialByPartner(partnerId),
      init,
      (dto) => this.getInitialValidator(partnerId, dto, false, false)
    );
  }

  public updateForcastEditor(saving: boolean, projectId: string, partnerId: string, dto: ForecastDetailsDTO[], submitClaim: boolean, message?: string, onComplete?: () => void) {
    super.updateEditor(
      saving,
      "forecastDetails",
      storeKeys.getPartnerKey(partnerId),
      dto,
      (show) => this.getValidator(partnerId, dto, show),
      (p) => ApiClient.forecastDetails.update({ projectId, partnerId, submit: submitClaim, forecasts: dto, ...p }),
      () => {
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete();
        }
      }
    );
  }

  public updateInitialForcastEditor(saving: boolean, projectId: string, partnerId: string, dto: ForecastDetailsDTO[], submit: boolean, message?: string, onComplete?: () => void) {
    super.updateEditor(
      saving,
      "initialForecastDetails",
      storeKeys.getPartnerKey(partnerId),
      dto,
      (show) => this.getInitialValidator(partnerId, dto, submit, show),
      (p) => ApiClient.initialForecastDetails.update({ projectId, partnerId, submit, forecasts: dto, ...p }),
      // tslint:disable-next-line:no-identical-functions
      () => {
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete();
        }
      }
    );
  }
}
