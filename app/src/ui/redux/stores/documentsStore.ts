import { StoreBase } from "./storeBase";
import { scrollToTheTopSmoothly } from "@framework/util";
import { ApiClient } from "@ui/apiClient";
import { Pending } from "@shared/pending";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { messageSuccess, RootActions, RootActionsOrThunk } from "../actions";
import { PartnersStore } from "./partnersStore";
import { RootState } from "..";
import { ClaimsStore } from "./claimsStore";
import { DocumentDescription } from "@framework/types";
import { returnStatement } from "@babel/types";

export class DocumentsStore extends StoreBase {
  constructor(private partnerStore: PartnersStore, private claimsStore: ClaimsStore, getState: () => RootState, queue: (action: RootActionsOrThunk) => void) {
    super(getState, queue);
  }

  private getProjectDocumentsKey(projectId: string) {
    return this.buildKey("projects", projectId);
  }

  private getPcrDocumentKey(projectId: string, pcrOrPCrItemId: string) {
    return this.buildKey("pcrs", projectId, pcrOrPCrItemId);
  }

  public getProjectDocuments(projectId: string) {
    return this.getData("documents", this.getProjectDocumentsKey(projectId), p => ApiClient.documents.getProjectDocuments({ projectId, ...p }));
  }

  public getProjectDocumentEditor(projectId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor(
      "multipleDocuments",
      this.getProjectDocumentsKey(projectId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      (dto) => Pending.done(this.validateDto(dto, false)));
  }

  private validateDto(dto: MultipleDocumentUploadDto, showErrors: boolean) {
    return new MultipleDocumentUpdloadDtoValidator(dto, this.getState().config, showErrors);
  }

  public updateProjectDocumentsEditor(saving: boolean, projectId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    this.updateEditor(
      saving,
      "multipleDocuments",
      this.getProjectDocumentsKey(projectId),
      dto,
      (show) => this.validateDto(dto, show),
      (p) => ApiClient.documents.uploadProjectDocument({ projectId, documents: dto, ...p }),
      () => this.afterUpdate(this.getProjectDocumentsKey(projectId), message, onComplete)
    );
  }

  public pcrOrPcrItemDocuments(projectId: string, projectChangeRequestIdOrItemId: string) {
    return this.getData(
      "documents",
      this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId),
      p => ApiClient.documents.getProjectChangeRequestDocumentsOrItemDocuments({ projectId, projectChangeRequestIdOrItemId, ...p })
    );
  }

  public getPcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, init?: (dto: MultipleDocumentUploadDto) => void) {
    return this.getEditor(
      "multipleDocuments",
      this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId),
      () => Pending.done<MultipleDocumentUploadDto>({ files: [] }),
      init,
      (dto) => Pending.done(this.validateDto(dto, false)));
  }

  private afterUpdate(key: string, message: string | undefined, onComplete: (() => void) | undefined) {
    this.markStale("documents", key, undefined);
    if (message) {
      this.queue(messageSuccess(message));
      scrollToTheTopSmoothly();
    }
    if (onComplete) {
      onComplete();
    }
  }

  public updatePcrOrPcrItemDocumentsEditor(saving: boolean, projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, message: string, onComplete?: () => void) {
    this.updateEditor(
      saving,
      "multipleDocuments",
      this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId),
      dto,
      (show) => this.validateDto(dto, show),
      (p) => ApiClient.documents.uploadProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documents: dto, ...p }),
      () => this.afterUpdate(this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId), message, onComplete)
    );
  }

  public deletePcrOrPcrItemDocumentsEditor(projectId: string, projectChangeRequestIdOrItemId: string, dto: MultipleDocumentUploadDto, document: DocumentSummaryDto, message: string, onComplete?: () => void) {
    this.deleteEditor(
      "multipleDocuments",
      this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId),
      dto,
      () => this.validateDto(dto, false),
      (p) => ApiClient.documents.deleteProjectChangeRequestDocumentOrItemDocument({ projectId, projectChangeRequestIdOrItemId, documentId: document.id, ...p }),
      () => this.afterUpdate(this.getPcrDocumentKey(projectId, projectChangeRequestIdOrItemId), message, onComplete)
    );
  }

  private getClaimKey(projectId: string, partnerId: string, periodId: number) {
    return this.buildKey("claim", projectId, partnerId, periodId);
  }

  public getClaimDocuments(projectId: string, partnerId: string, periodId: number) {
    return this.getData("documents", this.getClaimKey(projectId, partnerId, periodId), p => ApiClient.documents.getClaimDocuments({projectId, partnerId, periodId, ...p}));
  }

  public getIarDocument(projectId: string, partnerId: string, periodId: number): Pending<DocumentSummaryDto | null> {
    return this.getClaimDocuments(projectId, partnerId, periodId).then(x => x.filter(y => y.description === DocumentDescription.IAR).pop() || null);
  }

  public getCurrentClaimIarDocumentForLeadPartner(projectId: string): Pending<DocumentSummaryDto | null> {

    const combined = Pending.combine({
      partner:this.partnerStore.getLeadPartner(projectId),
      claims:this.claimsStore.getActiveClaimsForProject(projectId),
    });

    return combined.chain(({partner, claims}) => {
      if(partner) {
        const claim = claims.find(x => x.partnerId === partner.id && !x.isApproved);
        if(claim) {
          return this.getIarDocument(projectId, claim.partnerId, claim.periodId);
        }
      }
      return Pending.done<DocumentSummaryDto|null>(null);
    });
  }

}
