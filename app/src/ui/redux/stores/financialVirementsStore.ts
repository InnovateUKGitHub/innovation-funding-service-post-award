import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { NotFoundError } from "@shared/appError";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { FinancialVirementDtoValidator } from "@ui/validators";
import { FinancialVirementDto, PartnerVirementsDto } from "@framework/dtos";
import { LoadingStatus } from "@framework/constants";
import { IEditorStore } from "..";
import { StoreBase } from "./storeBase";

export class FinancialVirementsStore extends StoreBase {
  private getKey(projectId: string, pcrId: string, pcrItemId: string, partnerId?: string): string {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, pcrItemId, partnerId);
  }

  public get(projectId: string, pcrId: string, pcrItemId: string, partnerId?: string): Pending<FinancialVirementDto> {
    return this.getData("financialVirement", this.getKey(projectId, pcrId, pcrItemId, partnerId), p =>
      apiClient.financialVirements.get({ projectId, pcrItemId, pcrId, partnerId, ...p }),
    );
  }

  public getPartnerVirements(
    projectId: string,
    partnerId: string,
    pcrId: string,
    pcrItemId: string,
  ): Pending<PartnerVirementsDto> {
    return this.get(projectId, pcrId, pcrItemId, partnerId).chain((data, state) => {
      const partner = data.partners.find(x => x.partnerId === partnerId);
      return new Pending(
        partner ? state : LoadingStatus.Failed,
        partner,
        partner ? null : new NotFoundError("Could not find partner"),
      );
    });
  }

  public getFinancialVirementEditor(
    projectId: string,
    pcrId: string,
    pcrItemId: string,
    partnerId?: string,
  ): Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>> {
    return super.getEditor(
      "financialVirement",
      this.getKey(projectId, pcrId, pcrItemId, partnerId),
      () => this.get(projectId, pcrId, pcrItemId, partnerId),
      undefined,
      data => new FinancialVirementDtoValidator(data, false, false),
    );
  }

  public updateFinancialVirementEditor(
    saving: boolean,
    projectId: string,
    pcrId: string,
    pcrItemId: string,
    dto: FinancialVirementDto,
    submit: boolean,
    onComplete: () => void,
    partnerId?: string,
  ): void {
    return super.updateEditor(
      saving,
      "financialVirement",
      this.getKey(projectId, pcrId, pcrItemId, partnerId),
      dto,
      showErrors => new FinancialVirementDtoValidator(dto, showErrors, submit),
      p => apiClient.financialVirements.update({ projectId, pcrId, pcrItemId, financialVirement: dto, submit, ...p }),
      result => {
        if (partnerId) this.markStale("financialVirement", this.getKey(projectId, pcrId, pcrItemId, partnerId), result);
        this.markStale("financialVirement", this.getKey(projectId, pcrId, pcrItemId), result);
        onComplete();
      },
    );
  }
}
