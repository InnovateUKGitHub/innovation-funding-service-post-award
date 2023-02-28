import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ProjectChangeRequestDocumentsStore extends DocumentsStoreBase {
  private getKey(projectId: ProjectId, pcrOrPCrItemId: string) {
    return storeKeys.getPcrKey(projectId, pcrOrPCrItemId);
  }

  public pcrOrPcrItemDocuments(projectId: ProjectId, projectChangeRequestIdOrItemId: string) {
    return this.getData("documents", this.getKey(projectId, projectChangeRequestIdOrItemId), p =>
      apiClient.documents.getProjectChangeRequestDocumentsOrItemDocuments({
        projectId,
        projectChangeRequestIdOrItemId,
        ...p,
      }),
    );
  }

  public getPcrOrPcrItemDocumentsEditor(
    projectId: ProjectId,
    projectChangeRequestIdOrItemId: string,
    init?: (dto: MultipleDocumentUploadDto) => void,
  ) {
    return this.getEditor(
      "multipleDocuments",
      this.getKey(projectId, projectChangeRequestIdOrItemId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => Pending.done(this.validateMultipleDocumentsDto(dto, false, true)),
    );
  }

  public updatePcrOrPcrItemDocumentsEditor(
    saving: boolean,
    projectId: ProjectId,
    projectChangeRequestIdOrItemId: string,
    dto: MultipleDocumentUploadDto,
    filesRequired: boolean,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(projectId, projectChangeRequestIdOrItemId);
    this.updateMultiple(
      saving,
      filesRequired,
      key,
      dto,
      p =>
        apiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({
          projectId,
          projectChangeRequestIdOrItemId,
          ...p,
        }),
      message,
      onComplete,
    );
  }

  public deletePcrOrPcrItemDocumentsEditor(
    projectId: ProjectId,
    projectChangeRequestIdOrItemId: string,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(projectId, projectChangeRequestIdOrItemId);
    this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p =>
        apiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({
          projectId,
          projectChangeRequestIdOrItemId,
          documentId: document.id,
          ...p,
        }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }
}
