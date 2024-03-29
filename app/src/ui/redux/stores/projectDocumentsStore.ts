import { DocumentSummaryDto, PartnerDocumentSummaryDto } from "@framework/dtos/documentDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { Pending } from "@shared/pending";
import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ProjectDocumentsStore extends DocumentsStoreBase {
  private getProjectDocumentsKey(projectId: ProjectId) {
    return storeKeys.getProjectKey(projectId);
  }
  public getProjectDocuments(projectId: ProjectId) {
    return this.getData("documents", this.getProjectDocumentsKey(projectId), p =>
      apiClient.documents.getProjectDocuments({ projectId, ...p }),
    );
  }
  public getProjectDocumentEditor(projectId: ProjectId, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor(
      "multipleDocuments",
      this.getProjectDocumentsKey(projectId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => this.validateMultipleDocumentsDto(dto, false, true),
    );
  }

  public updateProjectDocumentsEditor(
    saving: boolean,
    projectId: ProjectId,
    dto: MultipleDocumentUploadDto,
    message: string,
    onComplete?: () => void,
  ) {
    this.updateMultiple(
      saving,
      true,
      this.getProjectDocumentsKey(projectId),
      dto,
      p => apiClient.documents.uploadProjectDocument({ projectId, ...p }),
      message,
      onComplete,
    );
  }

  public deleteProjectDocument(
    projectId: ProjectId,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto | PartnerDocumentSummaryDto,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getProjectDocumentsKey(projectId);
    return this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p => apiClient.documents.deleteProjectDocument({ documentId: document.id, projectId, ...p }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }

  public deleteProjectPartnerDocumentsEditor(
    projectId: ProjectId,
    partnerId: PartnerId | LinkedEntityId,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message: string,
    onComplete?: () => void,
  ) {
    const key = this.getProjectDocumentsKey(projectId);
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
