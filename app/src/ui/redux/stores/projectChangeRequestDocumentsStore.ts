import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ProjectChangeRequestDocumentsStore extends DocumentsStoreBase {

  private getPcrDocumentKey(projectId: string, pcrOrPCrItemId: string) {
    return this.buildKey("pcrs", projectId, pcrOrPCrItemId);
  }

  public pcrOrPcrItemDocuments(projectId: string, projectChangeRequestIdOrItemId: string) {
    return this.getData("documents", this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId), p => ApiClient.documents.getProjectChangeRequestDocumentsOrItemDocuments({ projectId, projectChangeRequestIdOrItemId, ...p }));
  }

  public getPcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => Pending.done(this.validateMultipleDocumentsDto(dto, false)));
  }

  public updatePcrOrPcrItemDocumentsEditor(saving: boolean, projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    const key = this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId);
    this.updateEditor(saving, "multipleDocuments", key, dto, (show) => this.validateMultipleDocumentsDto(dto, show), (p) => ApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documents: dto, ...p }), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

  public deletePcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message: string, onComplete?: () => void) {
    const key = this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId);
    this.deleteEditor("multipleDocuments", key, dto, () => this.validateMultipleDocumentsDto(dto, false), (p) => ApiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documentId: document.id, ...p }), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }
}
