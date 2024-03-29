import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ClaimDetailDocumentsStore extends DocumentsStoreBase {
  private getKey(partnerId: PartnerId, periodId: number, costCategoryId: CostCategoryId) {
    return storeKeys.getClaimDetailKey(partnerId, periodId, costCategoryId);
  }

  public getClaimDetailDocuments(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
  ) {
    return this.getData("documents", this.getKey(partnerId, periodId, costCategoryId), p =>
      apiClient.documents.getClaimDetailDocuments({
        claimDetailKey: { projectId, partnerId, periodId, costCategoryId },
        ...p,
      }),
    );
  }

  public getClaimDetailDocumentsEditor(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    init?: (dto: MultipleDocumentUploadDto) => void,
  ) {
    return this.getEditor(
      "multipleDocuments",
      this.getKey(partnerId, periodId, costCategoryId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => Pending.done(this.validateMultipleDocumentsDto(dto, false, true)),
    );
  }

  public updateClaimDetailDocumentsEditor(
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    dto: MultipleDocumentUploadDto,
    message: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(partnerId, periodId, costCategoryId);
    this.updateMultiple(
      saving,
      true,
      key,
      dto,
      p =>
        apiClient.documents.uploadClaimDetailDocuments({
          claimDetailKey: { projectId, partnerId, periodId, costCategoryId },
          ...p,
        }),
      message,
      onComplete,
    );
  }

  public deleteClaimDetailDocumentsEditor(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: PeriodId,
    costCategoryId: CostCategoryId,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(partnerId, periodId, costCategoryId);
    this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p =>
        apiClient.documents.deleteClaimDetailDocument({
          claimDetailKey: { projectId, partnerId, periodId, costCategoryId },
          documentId: document.id,
          ...p,
        }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }
}
