import { apiClient } from "@ui/apiClient";
import { ClaimDetailsValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ClaimDetailsDto } from "@framework/dtos";
import { StoreBase } from "./storeBase";

export class ClaimsDetailsStore extends StoreBase {
  private getKey(partnerId: string, periodId: number, costCategoryId: string) {
    return storeKeys.getClaimDetailKey(partnerId, periodId, costCategoryId);
  }

  public getAllByPartner(partnerId: string) {
    return this.getData("claimDetails", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.claimDetails.getAllByPartner({ partnerId, ...p }),
    );
  }

  public get(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
    return this.getData("claimDetail", this.getKey(partnerId, periodId, costCategoryId), p =>
      apiClient.claimDetails.get({ projectId, partnerId, periodId, costCategoryId, ...p }),
    );
  }

  public getClaimDetailsEditor(
    projectId: string,
    partnerId: string,
    periodId: number,
    costCategoryId: string,
    init?: (dto: ClaimDetailsDto) => void,
  ) {
    return this.getEditor(
      "claimDetail",
      this.getKey(partnerId, periodId, costCategoryId),
      () => this.get(projectId, partnerId, periodId, costCategoryId),
      init,
      dto => new ClaimDetailsValidator(dto, false),
    );
  }

  public updateClaimDetailsEditor(
    saving: boolean,
    projectId: string,
    partnerId: string,
    periodId: number,
    costCategoryId: string,
    dto: ClaimDetailsDto,
    onComplete?: (result: ClaimDetailsDto) => void,
  ): void {
    this.updateEditor(
      saving,
      "claimDetail",
      this.getKey(partnerId, periodId, costCategoryId),
      dto,
      show => new ClaimDetailsValidator(dto, show),
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
