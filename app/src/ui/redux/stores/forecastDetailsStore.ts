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

export class ForecastDetailsStore extends StoreBase {
  constructor(
    private claimsStore: ClaimsStore,
    private claimDetailsStore: ClaimsDetailsStore,
    private golCostsStore: ForecastGolCostsStore,
    getState: () => RootState, queue: (action: RootActionsOrThunk) => void
  ) {
    super(getState, queue);
  }

  public get(partnerId: string, periodId: number, costCategoryId: string) {
    return this.getData("forecastDetail", storeKeys.getForecastDetailKey(partnerId, periodId, costCategoryId), p => ApiClient.forecastDetails.get({partnerId, periodId, costCategoryId, ...p}));
  }

  public getAllByPartner(partnerId: string) {
    return this.getData("forecastDetails", storeKeys.getForecastDetailsForPartnerKey(partnerId), p => ApiClient.forecastDetails.getAllByPartnerId({ partnerId, ...p }));
  }

  private getValidator(partnerId: string, dto: ForecastDetailsDTO[], showValidationErrors: boolean) {
    const combined = Pending.combine({
      claims: this.claimsStore.getAllClaimsForPartner(partnerId),
      claimDetails: this.claimDetailsStore.getAllByPartner(partnerId),
      golCosts: this.golCostsStore.getAllByPartner(partnerId),
    });
    return combined.then(x => new ForecastDetailsDtosValidator(dto, x.claims, x.claimDetails, x.golCosts, showValidationErrors));
  }

  public getForecastEditor(partnerId: string, init?: (data: ForecastDetailsDTO[]) => void) {
    return this.getEditor(
      "forecastDetails",
      storeKeys.getForecastDetailsForPartnerKey(partnerId),
      () => this.getAllByPartner(partnerId),
      init,
      (dto) => this.getValidator(partnerId, dto, false)
    );
  }

  public updateForcastEditor(saving: boolean, projectId: string, partnerId: string, dto: ForecastDetailsDTO[], submitClaim: boolean, message?: string, onComplete?: () => void) {
    super.updateEditor(
      saving,
      "forecastDetails",
      storeKeys.getForecastDetailsForPartnerKey(partnerId),
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
}
