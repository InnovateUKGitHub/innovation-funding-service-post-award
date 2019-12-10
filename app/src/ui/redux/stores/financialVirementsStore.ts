import { StoreBase } from "./storeBase";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { NotFoundError } from "@server/features/common";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { FinancialVirementDtoValidator } from "@ui/validators";

export class FinancialVirementsStore extends StoreBase {
  private getKey(projectId: string, pcrId: string, pcrItemId: string) {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, pcrItemId);
  }

  public get(projectId: string, pcrId: string, pcrItemId: string) {
    return this.getData("financialVirement", this.getKey(projectId, pcrId, pcrItemId), p => ApiClient.financialVirements.get({ projectId, pcrItemId, pcrId, ...p }));
  }

  public getPartnerVirements(projectId: string, partnerId: string, pcrId: string, pcrItemId: string) {
    return this.get(projectId, pcrId, pcrItemId).chain((data, state) => {
      const partner = data.partners.find(x => x.partnerId === partnerId);
      return new Pending(partner ? state : LoadingStatus.Failed, partner, partner ? null : new NotFoundError("Could not find partner"));
    });
  }

  public getFiniancialVirementEditor(projectId: string, pcrId: string, pcrItemId: string) {
    return super.getEditor(
      "financialVirement",
      this.getKey(projectId, pcrId, pcrItemId),
      () => this.get(projectId, pcrId, pcrItemId),
      undefined,
      (data) => new FinancialVirementDtoValidator(data, false)
    );
  }

  public updateFiniancialVirementEditor(saving: boolean, projectId: string, pcrId: string, pcrItemId: string, dto: FinancialVirementDto, onComplete: () => void) {
    return super.updateEditor(
      saving,
      "financialVirement",
      this.getKey(projectId,pcrId, pcrItemId),
      dto,
      (showErrors) => new FinancialVirementDtoValidator(dto, showErrors),
      (p) => ApiClient.financialVirements.update({projectId, pcrId, pcrItemId, financialVirment: dto, ...p}),
      (result) => {
        this.markStale("financialVirement", this.getKey(projectId, pcrId, pcrItemId), result);
        onComplete();
      }
   );
  }
}
