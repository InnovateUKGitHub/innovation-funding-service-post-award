import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { FinancialLoanVirementDtoValidator } from "@ui/validators";
import { FinancialLoanVirementDto } from "@framework/dtos";
import { IEditorStore } from "..";
import { StoreBase } from "./storeBase";

export class FinancialLoanVirementsStore extends StoreBase {
  private getKey(projectId: ProjectId, pcrId: string, pcrItemId: string): string {
    return storeKeys.getFinancialLoanVirementKey(projectId, pcrId, pcrItemId);
  }

  public get(projectId: ProjectId, pcrId: string, pcrItemId: string): Pending<FinancialLoanVirementDto> {
    return this.getData("financialLoanVirement", this.getKey(projectId, pcrId, pcrItemId), p =>
      apiClient.financialLoanVirements.get({ ...p, projectId, pcrItemId }),
    );
  }

  public getFinancialVirementEditor(
    projectId: ProjectId,
    pcrId: string,
    pcrItemId: string,
    displayValidations: boolean,
    forceRefreshEditor?: boolean,
  ): Pending<IEditorStore<FinancialLoanVirementDto, FinancialLoanVirementDtoValidator>> {
    return super.getEditor(
      "financialLoanVirement",
      this.getKey(projectId, pcrId, pcrItemId),
      () => this.get(projectId, pcrId, pcrItemId),
      undefined,
      data => new FinancialLoanVirementDtoValidator(data, displayValidations, displayValidations),
      forceRefreshEditor,
    );
  }

  public updateFinancialVirementEditor(
    saving: boolean,
    projectId: ProjectId,
    pcrId: string,
    pcrItemId: string,
    dto: FinancialLoanVirementDto,
    submit: boolean,
  ): void {
    return super.updateEditor(
      saving,
      "financialLoanVirement",
      this.getKey(projectId, pcrId, pcrItemId),
      dto,
      showErrors => new FinancialLoanVirementDtoValidator(dto, showErrors, submit),
      p => apiClient.financialLoanVirements.update({ ...p, projectId, pcrItemId, financialVirement: dto, submit }),
      result => {
        this.markStale("financialLoanVirement", this.getKey(projectId, pcrId, pcrItemId), result);
      },
    );
  }
}
