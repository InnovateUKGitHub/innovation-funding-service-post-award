import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ClaimDetailDocumentsStore extends DocumentsStoreBase {

  private getKey(partnerId: string, periodId: number, costCategoryId: string) {
    return storeKeys.getClaimDetailKey(partnerId, periodId, costCategoryId);
  }

  public getClaimDetailDocuments(projectId: string, partnerId: string, periodId: number, costCategoryId: string) {
    return this.getData("documents", this.getKey(partnerId, periodId, costCategoryId), p => ApiClient.documents.getClaimDetailDocuments({ claimDetailKey: { projectId, partnerId, periodId, costCategoryId }, ...p }));
  }

  public getClaimDetailDocumentsEditor(projectId: string, partnerId: string, periodId: number, costCategoryId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getKey(partnerId, periodId, costCategoryId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => Pending.done(this.validateMultipleDocumentsDto(dto, false)));
  }

  public updateClaimDetailDocumentsEditor(saving: boolean, projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    const key = this.getKey(partnerId, periodId, costCategoryId);
    this.updateMultiple(
      saving,
      key,
      dto,
      (p) => ApiClient.documents.uploadClaimDetailDocuments({ claimDetailKey: { projectId, partnerId, periodId, costCategoryId }, ...p }),
      message,
      onComplete
    );
  }

  public deleteClaimDetailDocumentsEditor(projectId: string, partnerId: string, periodId: number, costCategoryId: string, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message?: string, onComplete?: () => void) {
    const key = this.getKey(partnerId, periodId, costCategoryId);
    this.deleteEditor("multipleDocuments", key, dto, () => this.validateMultipleDocumentsDto(dto, false), (p) => ApiClient.documents.deleteClaimDetailDocument({ claimDetailKey: { projectId, partnerId, periodId, costCategoryId }, documentId: document.id, ...p }), () => this.afterUpdate(key, message, onComplete));
  }
}
