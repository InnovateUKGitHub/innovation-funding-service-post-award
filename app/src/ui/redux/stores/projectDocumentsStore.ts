import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";

export class ProjectDocumentsStore extends DocumentsStoreBase {
  private getProjectDocumentsKey(projectId: string) {
    return storeKeys.getProjectKey(projectId);
  }
  public getProjectDocuments(projectId: string) {
    return this.getData("documents", this.getProjectDocumentsKey(projectId), p => ApiClient.documents.getProjectDocuments({ projectId, ...p }));
  }
  public getProjectDocumentEditor(projectId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getProjectDocumentsKey(projectId), () => Pending.done<MultipleDocumentUploadDto>({ files: [] }), init, (dto) => this.validateMultipleDocumentsDto(dto, false, true));
  }

  public updateProjectDocumentsEditor(saving: boolean, projectId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    this.updateMultiple(
      saving,
      true,
      this.getProjectDocumentsKey(projectId),
      dto,
      (p) => ApiClient.documents.uploadProjectDocument({ projectId, ...p }),
      message,
      onComplete
    );
  }
}
