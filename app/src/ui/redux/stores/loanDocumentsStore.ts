import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";

export class LoanDocumentsStore extends DocumentsStoreBase {
  private getKey(projectId: ProjectId, loanId: LoanId) {
    return storeKeys.getLoanKey(projectId, loanId);
  }
  public getLoanDocuments(projectId: ProjectId, loanId: LoanId) {
    return this.getData("documents", this.getKey(projectId, loanId), p =>
      apiClient.documents.getLoanDocuments({ ...p, projectId, loanId }),
    );
  }
  public getLoanDocumentsEditor(projectId: ProjectId, loanId: LoanId, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor(
      "multipleDocuments",
      this.getKey(projectId, loanId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => this.validateMultipleDocumentsDto(dto, false, true),
    );
  }

  public updateLoanDocumentsEditor(
    saving: boolean,
    projectId: ProjectId,
    loanId: LoanId,
    dto: MultipleDocumentUploadDto,
    message: string,
    onComplete?: () => void,
  ) {
    this.updateMultiple(
      saving,
      true,
      this.getKey(projectId, loanId),
      dto,
      p => apiClient.documents.uploadLoanDocuments({ ...p, projectId, loanId }),
      message,
      onComplete,
    );
  }

  public deleteLoanDocument(
    projectId: ProjectId,
    loanId: LoanId,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(projectId, loanId);
    return this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p => apiClient.documents.deleteLoanDocument({ projectId, loanId, documentId: document.id, ...p }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }
}
