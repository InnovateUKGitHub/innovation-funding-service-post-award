import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class LoanDocumentsStore extends DocumentsStoreBase {
  private getKey(projectId: string, loanId: string) {
    return storeKeys.getLoanKey(projectId, loanId);
  }
  public getLoanDocuments(projectId: string, loanId: string) {
    return this.getData("documents", this.getKey(projectId, loanId), p =>
      apiClient.documents.getLoanDocuments({ ...p, projectId, loanId }),
    );
  }
  public getLoanDocumentsEditor(projectId: string, loanId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
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
    projectId: string,
    loanId: string,
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
    projectId: string,
    loanId: string,
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
