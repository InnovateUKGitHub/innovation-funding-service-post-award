import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { ClaimDetailsValidator } from "@ui/validators";

export class ClaimsDetailsStore extends StoreBase {
  private getKey(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
    return this.buildKey(partnerId, periodId, costCategoryId);
  }

  public getAllByPartner(partnerId: string) {
    return this.getData("claimDetails", partnerId, p => ApiClient.claimDetails.getAllByPartner({partnerId, ...p}));
  }

  public get(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
    return this.getData("claimDetail", this.getKey(projectId, partnerId, periodId, costCategoryId), p => ApiClient.claimDetails.get({projectId, partnerId, periodId, costCategoryId, ...p}));
  }

  public getClaimDetailsEditor(projectId: string, partnerId: string, periodId: number, costCategoryId: string, init?: (dto: ClaimDetailsDto) => void) {
    return this.getEditor(
      "claimDetail",
      this.getKey(projectId, partnerId, periodId, costCategoryId),
      () => this.get(projectId, partnerId, periodId, costCategoryId),
      init,
      (dto) => new ClaimDetailsValidator(dto, false)
      );
  }

  public updateClaimDetailsEditor(saving: boolean, projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: ClaimDetailsDto, onComplete?: (result: ClaimDetailsDto) => void): void {
    this.updateEditor(
      saving,
      "claimDetail",
      this.getKey(projectId, partnerId, periodId, costCategoryId),
      dto,
      (show) => new ClaimDetailsValidator(dto, show),
      p => ApiClient.claimDetails.saveClaimDetails({projectId, partnerId, periodId, costCategoryId, claimDetails: dto, ...p}),
      (result) => {
        this.markStale("claimDetail", this.getKey(projectId, partnerId, periodId, costCategoryId), result);
        if(onComplete) {
          onComplete(result);
        }
      }
    );
  }
}
