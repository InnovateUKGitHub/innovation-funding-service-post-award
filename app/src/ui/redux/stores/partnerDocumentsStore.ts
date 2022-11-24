import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Pending } from "@shared/pending";
import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class PartnerDocumentsStore extends DocumentsStoreBase {
  private getKey(partnerId: string) {
    return storeKeys.getPartnerKey(partnerId);
  }
  private getProjectKey(projectId: string) {
    return storeKeys.getProjectKey(projectId);
  }

  public getPartnerDocuments(projectId: string, partnerId: string) {
    return this.getData("documents", this.getKey(partnerId), p =>
      apiClient.documents.getPartnerDocuments({ projectId, partnerId, ...p }),
    );
  }

  public getAllPartnerDocuments(projectId: string) {
    // When obtaining ALL partner documents, the documents Redux key is linked to the projectId,
    // instead of each individual partner id.
    return this.getData("partnerDocuments", this.getProjectKey(projectId), p =>
      apiClient.documents.getAllPartnerDocuments({ projectId, ...p }),
    );
  }

  public getPartnerDocumentEditor(partnerId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor(
      "multipleDocuments",
      this.getKey(partnerId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => this.validateMultipleDocumentsDto(dto, false, true),
    );
  }

  public updatePartnerDocumentsEditor(
    saving: boolean,
    projectId: string,
    partnerId: string,
    dto: MultipleDocumentUploadDto,
    message: string,
    onComplete?: () => void,
  ) {
    this.updateMultiple(
      saving,
      true,
      this.getKey(partnerId),
      dto,
      p => apiClient.documents.uploadPartnerDocument({ projectId, partnerId, ...p }),
      message,
      onComplete,
    );
  }

  public deletePartnerDocumentsEditor(
    projectId: string,
    partnerId: string,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(partnerId);
    this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p => apiClient.documents.deletePartnerDocument({ projectId, partnerId, documentId: document.id, ...p }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }
}
