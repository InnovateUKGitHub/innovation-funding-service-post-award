import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ProjectChangeRequestDocumentsStore extends DocumentsStoreBase {

  private getKey(projectId: string, pcrOrPCrItemId: string) {
    return storeKeys.getPcrKey(projectId, pcrOrPCrItemId);
  }

  public pcrOrPcrItemDocuments(projectId: string, projectChangeRequestIdOrItemId: string) {
    return this.getData("documents", this.getKey(projectId, projectChangeRequestIdOrItemId), p => ApiClient.documents.getProjectChangeRequestDocumentsOrItemDocuments({ projectId, projectChangeRequestIdOrItemId, ...p }));
  }

  public getPcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getKey(projectId, projectChangeRequestIdOrItemId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => Pending.done(this.validateMultipleDocumentsDto(dto, false)));
  }

  public updatePcrOrPcrItemDocumentsEditor(saving: boolean, projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, filesRequired: boolean, message?: string, onComplete?: () => void) {
    const key = this.getKey(projectId, projectChangeRequestIdOrItemId);
    this.updateMultiple(
      saving,
      key,
      dto,
      (p) => ApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, ...p }),
      message,
      onComplete
    );
  }

  public deletePcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message: string, onComplete?: () => void) {
    const key = this.getKey(projectId, projectChangeRequestIdOrItemId);
    this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false),
      (p) => ApiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documentId: document.id, ...p }),
      () => this.afterUpdate(key, message, onComplete)
    );
  }
}
