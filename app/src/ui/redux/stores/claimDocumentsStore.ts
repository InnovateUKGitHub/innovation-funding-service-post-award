import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { RootActionsOrThunk } from "../actions";
import { PartnersStore } from "./partnersStore";
import { ClaimsStore } from "./claimsStore";
import { DocumentDescription } from "@framework/types";
import { RootState } from "../reducers";
import { DocumentsStoreBase } from "./documentsStoreBase";

export class ClaimDocumentsStore extends DocumentsStoreBase {

  constructor(private partnerStore: PartnersStore, private claimsStore: ClaimsStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  protected getIARKey(projectId: string, partnerId: string, periodId: number) {
    return this.buildKey(DocumentDescription.IAR, projectId, partnerId, periodId);
  }

  public getIarDocument(projectId: string, partnerId: string, periodId: number) {
    return this.getData("documents", this.getIARKey(projectId, partnerId, periodId), p => ApiClient.documents.getClaimDocuments({ projectId, partnerId, periodId, description: DocumentDescription.IAR, ...p }))
      .then(x => x.length ? x[0] : null);
  }

  public getClaimDocuments(projectId: string, partnerId: string, periodId: number) {
    const key = this.buildKey("claimDocuments", projectId, partnerId, periodId);
    return this.getData("documents", key, p => ApiClient.documents.getClaimDocuments({projectId, partnerId, periodId, ...p}));
  }

  public getCurrentClaimIarForPartner(projectId: string, partnerId: string) {
    return this.claimsStore.getActiveClaimForPartner(partnerId).chain(claim => {
      if (!claim) {
        return new Pending(LoadingStatus.Done, null);
      }
      return this.getIarDocument(projectId, partnerId, claim.periodId);
    });
  }

  public getCurrentClaimIarForLeadPartner(projectId: string) {
    return Pending.combine({
      partner: this.partnerStore.getLeadPartner(projectId),
      claims: this.claimsStore.getActiveClaimsForProject(projectId)
    }).then(x => ({
      partner: x.partner,
      claim: x.claims.find(y => y.partnerId === x.partner.id)
    })).chain(x => {
      if (!x.claim) {
        return new Pending(LoadingStatus.Done, null);
      }
      return this.getIarDocument(projectId, x.partner.id, x.claim.periodId);
    });
  }

  public getIAREditor(projectId: string, partnerId: string, periodId: number, init?: (dto: DocumentUploadDto) => void) {
    return this.getEditor("documents", this.getIARKey(projectId, partnerId, periodId), () => Pending.done<DocumentUploadDto>({ file: null, description: DocumentDescription.IAR }), init, (dto) => this.validateDocumentUploadDto(dto, false));
  }

  public getClaimDocumentsEditor(projectId: string, partnerId: string, periodId: number, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor("multipleDocuments", this.buildKey("claimDocuments", projectId, partnerId, periodId), () => Pending.done<MultipleDocumentUploadDto>({files: []}), init, (dto) => this.validateMultipleDocumentsDto(dto, false));
  }

  public getIarEditorForCurrentPartnerClaim(projectId: string, partnerId: string, init?: (dto: DocumentUploadDto) => void) {
    return this.claimsStore.getActiveClaimForPartner(partnerId).chain(claim => {
      if (!claim) {
        return Pending.done(null);
      }
      return this.getIAREditor(projectId, partnerId, claim.periodId, init);
    });
  }

  public getCurrentClaimIarEditorForLeadPartner(projectId: string, init?: (dto: DocumentUploadDto) => void) {
    return Pending.combine({
      partner: this.partnerStore.getLeadPartner(projectId),
      activeClaims: this.claimsStore.getActiveClaimsForProject(projectId)
    }).then(x => ({
      partner: x.partner,
      claim: x.activeClaims.find(y => y.partnerId === x.partner.id)
    })).chain(x => {
      if (!x.claim) {
        return Pending.done(null);
      }
      return this.getIAREditor(projectId, x.partner.id, x.claim.periodId, init);
    });
  }

  public updateIAREditor(saving: boolean, projectId: string, partnerId: string, periodId: number, dto: DocumentUploadDto, message?: string, onComplete?: () => void) {
    const key = this.getIARKey(projectId, partnerId, periodId);
    return this.updateEditor(saving, "documents", key, dto, show => this.validateDocumentUploadDto(dto, show), p => ApiClient.documents.uploadClaimDocument({ claimKey: { projectId, partnerId, periodId }, document: dto, ...p }), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

  public updateClaimDocumentsEditor(saving: boolean, projectId: string, partnerId: string, periodId: number, dto: MultipleDocumentUploadDto, message?: string, onComplete?: () => void) {
    const key = this.buildKey("claimDocuments", projectId, partnerId, periodId);
    return this.updateEditor(saving, "multipleDocuments", key, dto, show => this.validateMultipleDocumentsDto(dto, show), p => ApiClient.documents.uploadClaimDocuments({claimKey: {projectId, partnerId, periodId }, documents: dto, ...p}), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

  public deleteIARDocument(projectId: string, partnerId: string, periodId: number, dto: DocumentUploadDto, document: DocumentSummaryDto, message?: string, onComplete?: () => void) {
    const key = this.getIARKey(projectId, partnerId, periodId);
    return this.deleteEditor("documents", key, dto, () => this.validateDocumentUploadDto(dto, false), p => ApiClient.documents.deleteClaimDocument({ claimKey: { projectId, partnerId, periodId }, documentId: document.id, ...p }), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

  public deleteClaimDocument(projectId: string, partnerId: string, periodId: number, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message?: string, onComplete?: () => void) {
    const key = this.buildKey("claimDocuments", projectId, partnerId, periodId);
    return this.deleteEditor("multipleDocuments", key, dto, () => this.validateMultipleDocumentsDto(dto, false), p => ApiClient.documents.deleteClaimDocument({claimKey: {projectId, partnerId, periodId}, documentId: document.id, ...p}), () => this.afterUpdate("documents", "multipleDocuments", key, message, onComplete));
  }

}
