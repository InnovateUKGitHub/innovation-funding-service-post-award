import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";
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
  `${partnerId}_${periodId}_${costCategoryId}`
);
