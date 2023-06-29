import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { NotFoundError } from "@shared/appError";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { StoreBase } from "./storeBase";
import { LoadingStatus } from "@framework/constants/enums";
import { FinancialVirementDto, PartnerVirementsDto } from "@framework/dtos/financialVirementDto";
import { FinancialVirementDtoValidator } from "@ui/validation/validators/financialVirementDtoValidator";
import { IEditorStore } from "../reducers/editorsReducer";

export class FinancialVirementsStore extends StoreBase {
  private getKey(projectId: ProjectId, pcrId: PcrId, pcrItemId: PcrItemId, partnerId?: PartnerId): string {
    return storeKeys.getFinancialVirementKey(projectId, pcrId, pcrItemId, partnerId);
  }

  public get(
    projectId: ProjectId,
    pcrId: PcrId,
    pcrItemId: PcrItemId,
    partnerId?: PartnerId,
  ): Pending<FinancialVirementDto> {
    return this.getData("financialVirement", this.getKey(projectId, pcrId, pcrItemId, partnerId), p =>
      apiClient.financialVirements.get({ projectId, pcrItemId, pcrId, partnerId, ...p }),
    );
  }

  public getPartnerVirements(
    projectId: ProjectId,
    partnerId: PartnerId,
    pcrId: PcrId,
    pcrItemId: PcrItemId,
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
    projectId: ProjectId,
    pcrId: PcrId,
    pcrItemId: PcrItemId,
    partnerId?: PartnerId,
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
    projectId: ProjectId,
    pcrId: PcrId,
    pcrItemId: PcrItemId,
    dto: FinancialVirementDto,
    submit: boolean,
    onComplete: () => void,
    partnerId?: PartnerId,
  ): void {
    return super.updateEditor(
      saving,
      "financialVirement",
      this.getKey(projectId, pcrId, pcrItemId, partnerId),
      dto,
      showErrors => new FinancialVirementDtoValidator(dto, showErrors, submit),
      p =>
        apiClient.financialVirements.update({
          projectId,
          pcrId,
          pcrItemId,
          financialVirement: dto,
          partnerId,
          submit,
          ...p,
        }),
      result => {
        if (partnerId) this.markStale("financialVirement", this.getKey(projectId, pcrId, pcrItemId, partnerId), result);
        this.markStale("financialVirement", this.getKey(projectId, pcrId, pcrItemId), result);
        onComplete();
      },
    );
  }
}
