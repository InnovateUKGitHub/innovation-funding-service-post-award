import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
import { IEditorStore, RootState } from "../reducers";
import { getCurrentClaim } from "./claims";
import { DocumentDescription } from "../../../types";

export const documentStore = "documents";
export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDocuments = (partnerId: string, periodId: number, filter?: string) => dataStoreHelper(documentStore, getKey("claim", filter || "All", partnerId, periodId));

export const getClaimIarDocuments = (partnerId: string, periodId: number) => getClaimDocuments(partnerId, periodId, DocumentDescription.IAR);

export const getClaimDetailDocumentEditor = ({partnerId, periodId, costCategoryId}: ClaimDetailKey) => editorStoreHelper<ClaimDetailDocumentDto, DocumentUploadValidator>(
  "claimDetailDocument",
  x => x.claimDetailDocument,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey(partnerId, periodId, costCategoryId)
);

export const getClaimDocumentEditor = ({partnerId, periodId}: ClaimKey) => editorStoreHelper<DocumentUploadDto, DocumentUploadValidator>(
  "claimDocument",
  x => x.claimDocument,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  getKey(partnerId, periodId)
);

export const getCurrentClaimDocumentsEditor = (state: RootState, partnerId: string): Pending<IEditorStore<DocumentUploadDto, DocumentUploadValidator> | null> => {
  return getCurrentClaim(state, partnerId).then(claim => {
    if (!claim) {
      return null;
    }
    const editorPending =  getClaimDocumentEditor({partnerId, periodId: claim.periodId}).get(state);
    return editorPending.data || null;
  });
};
