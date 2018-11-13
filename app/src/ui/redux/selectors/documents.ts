import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "../../../util/key";
import { Results } from "../../validation/results";
import { LoadingStatus, Pending } from "../../../shared/pending";
import {DocumentUploadValidator} from "../../validators/documentUploadValidator";

export const documentStore = "documents";
export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId));

export const getClaimDetailDocumentEditor = ({partnerId, periodId, costCategoryId}: ClaimDetailKey) => editorStoreHelper<ClaimDetailDocumentDto, Results<ClaimDetailDocumentDto>>(
  "claimDetailDocument",
  x => x.claimDetailDocument,
  () => (Pending.create({ status: LoadingStatus.Done, data: { file: null }, error: null})),
  (dto) => new DocumentUploadValidator(dto, false),
  `${partnerId}_${periodId}_${costCategoryId}`
);
