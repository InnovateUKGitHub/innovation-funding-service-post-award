import { apiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { PartnersStore } from "./partnersStore";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

export class ClaimDocumentsStore extends DocumentsStoreBase {
  constructor(
    private readonly partnerStore: PartnersStore,
    getState: () => RootState,
    queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  private getKey(partnerId: PartnerId, periodId: number) {
    return storeKeys.getClaimKey(partnerId, periodId);
  }

  public getClaimDocuments(projectId: ProjectId, partnerId: PartnerId, periodId: number) {
    return this.getData("documents", this.getKey(partnerId, periodId), p =>
      apiClient.documents.getClaimDocuments({ projectId, partnerId, description: undefined, periodId, ...p }),
    );
  }

  public getClaimDocumentsEditor(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    init?: (dto: MultipleDocumentUploadDto) => void,
  ) {
    return this.getEditor(
      "multipleDocuments",
      this.getKey(partnerId, periodId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      dto => this.validateMultipleDocumentsDto(dto, false, true),
    );
  }

  public updateClaimDocumentsEditor(
    saving: boolean,
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    dto: MultipleDocumentUploadDto,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(partnerId, periodId);
    return this.updateMultiple(
      saving,
      true,
      key,
      dto,
      p => apiClient.documents.uploadClaimDocuments({ claimKey: { projectId, partnerId, periodId }, ...p }),
      message,
      onComplete,
    );
  }

  public deleteClaimDocument(
    projectId: ProjectId,
    partnerId: PartnerId,
    periodId: number,
    dto: MultipleDocumentUploadDto,
    document: DocumentSummaryDto,
    message?: string,
    onComplete?: () => void,
  ) {
    const key = this.getKey(partnerId, periodId);
    return this.deleteEditor(
      "multipleDocuments",
      key,
      dto,
      () => this.validateMultipleDocumentsDto(dto, false, true),
      p =>
        apiClient.documents.deleteClaimDocument({
          claimKey: { projectId, partnerId, periodId },
          documentId: document.id,
          ...p,
        }),
      () => this.afterUpdate(key, message, true, onComplete),
    );
  }
}
