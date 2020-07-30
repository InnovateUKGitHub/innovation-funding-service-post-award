import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export class PartnerDocumentsStore extends DocumentsStoreBase {
  private getKey(partnerId: string) {
    return storeKeys.getPartnerKey(partnerId);
  }
  public getPartnerDocuments(projectId: string, partnerId: string) {
    return this.getData("documents", this.getKey(partnerId), p => ApiClient.documents.getPartnerDocuments({ projectId, partnerId, ...p }));
  }
  public getPartnerDocumentEditor(partnerId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getKey(partnerId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => this.validateMultipleDocumentsDto(dto, false, true));
  }

  public updatePartnerDocumentsEditor(saving: boolean, projectId: string, partnerId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    this.updateMultiple(
      saving,
      true,
      this.getKey(partnerId),
      dto,
      (p) => ApiClient.documents.uploadPartnerDocument({ projectId, partnerId, ...p }),
      message,
      onComplete
    );
  }

  public deletePartnerDocumentsEditor(projectId: string, partnerId: string, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message: string, onComplete?: () => void) {
    const key = this.getKey(partnerId);
    this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      (p) => ApiClient.documents.deletePartnerDocument({ projectId, partnerId, documentId: document.id, ...p }),
      () => this.afterUpdate(key, message, onComplete)
    );
  }
}
