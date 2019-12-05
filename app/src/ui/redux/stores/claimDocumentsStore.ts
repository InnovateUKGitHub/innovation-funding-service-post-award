import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { RootActionsOrThunk } from "../actions";
import { PartnersStore } from "./partnersStore";
import { ClaimsStore } from "./claimsStore";
import { RootState } from "../reducers";
import { DocumentsStoreBase } from "./documentsStoreBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ClaimDocumentsStore extends DocumentsStoreBase {

  constructor(private partnerStore: PartnersStore, private claimsStore: ClaimsStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  private getKey(partnerId: string, periodId: number) {
    return storeKeys.getClaimDocumentsKey(partnerId, periodId);
  }

  public getClaimDocuments(projectId: string, partnerId: string, periodId: number) {
    return this.getData("documents", this.getKey(partnerId, periodId), p => ApiClient.documents.getClaimDocuments({projectId, partnerId, periodId, ...p}));
  }

  public getClaimDocumentsEditor(projectId: string, partnerId: string, periodId: number, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.getKey(partnerId, periodId), () => Pending.done<MultipleDocumentUploadDto>({files: []}), init, (dto) => this.validateMultipleDocumentsDto(dto, false));
  }

  public updateClaimDocumentsEditor(saving: boolean, projectId: string, partnerId: string, periodId: number, dto: MultipleDocumentUploadDto, message?: string, onComplete?: () => void) {
    const key = this.getKey(partnerId, periodId);
    return this.updateEditor(saving, "multipleDocuments", key, dto, show => this.validateMultipleDocumentsDto(dto, show), p => ApiClient.documents.uploadClaimDocuments({claimKey: {projectId, partnerId, periodId }, documents: dto, ...p}), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

  public deleteClaimDocument(projectId: string, partnerId: string, periodId: number, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message?: string, onComplete?: () => void) {
    const key = this.getKey(partnerId, periodId);
    return this.deleteEditor("multipleDocuments", key, dto, () => this.validateMultipleDocumentsDto(dto, false), p => ApiClient.documents.deleteClaimDocument({claimKey: {projectId, partnerId, periodId}, documentId: document.id, ...p}), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

}
