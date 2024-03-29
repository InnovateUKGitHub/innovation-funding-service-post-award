import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDetailsValidator } from "@ui/validation/validators/claimDetailsValidator";
import { StoreBase } from "./storeBase";

export class ClaimsDetailsStore extends StoreBase {
  private getKey(partnerId: PartnerId, periodId: PeriodId, costCategoryId: CostCategoryId) {
    return storeKeys.getClaimDetailKey(partnerId, periodId, costCategoryId);
  }

  public getAllByPartner(partnerId: PartnerId) {
    return this.getData("claimDetails", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.claimDetails.getAllByPartner({ partnerId, ...p }),
    );
  }

  public get(projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId, costCategoryId: CostCategoryId) {
    return this.getData("claimDetail", this.getKey(partnerId, periodId, costCategoryId), p =>
      apiClient.claimDetails.get({ projectId, partnerId, periodId, costCategoryId, ...p }),
    );
  }

  public getClaimDetailsEditor(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    init?: (dto: ClaimDetailsDto) => void,
  ) {
    return this.getEditor(
      "claimDetail",
      this.getKey(partnerId, periodId, costCategoryId),
      () => this.get(projectId, partnerId, periodId, costCategoryId),
      init,
      dto => new ClaimDetailsValidator({ model: dto, showValidationErrors: false }),
    );
  }

  public updateClaimDetailsEditor(
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    dto: ClaimDetailsDto,
    onComplete?: (result: ClaimDetailsDto) => void,
  ): void {
    this.updateEditor(
      saving,
      "claimDetail",
      this.getKey(partnerId, periodId, costCategoryId),
      dto,
      show => new ClaimDetailsValidator({ model: dto, showValidationErrors: show }),
      p =>
        apiClient.claimDetails.saveClaimDetails({
          projectId,
          partnerId,
          periodId,
          costCategoryId,
          claimDetails: dto,
          ...p,
        }),
      result => {
        this.markStale("claimDetail", this.getKey(partnerId, periodId, costCategoryId), result);
        if (onComplete) {
          onComplete(result);
        }
      },
    );
  }
}
