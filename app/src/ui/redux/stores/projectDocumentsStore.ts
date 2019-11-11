import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ProjectDocumentsStore extends DocumentsStoreBase {
  private getProjectDocumentsKey(projectId: string) {
    return this.buildKey("projects", projectId);
  }
  public getProjectDocuments(projectId: string) {
    return this.getData("documents", this.getProjectDocumentsKey(projectId), p => ApiClient.documents.getProjectDocuments({ projectId, ...p }));
  }
  public getProjectDocumentEditor(projectId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getProjectDocumentsKey(projectId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => this.validateMultipleDocumentsDto(dto, false));
  }
  public updateProjectDocumentsEditor(saving: boolean, projectId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    this.updateEditor(saving, "multipleDocuments", this.getProjectDocumentsKey(projectId), dto, (show) => this.validateMultipleDocumentsDto(dto, show), (p) => ApiClient.documents.uploadProjectDocument({ projectId, documents: dto, ...p }), () => this.afterUpdate("documents", "multipleDocuments", this.getProjectDocumentsKey(projectId), message, onComplete));
  }
}
