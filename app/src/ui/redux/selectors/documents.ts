import { editorStoreHelper } from "./common";
import { Pending } from "../../../shared/pending";
import { MultipleDocumentUpdloadDtoValidator } from "../../validators/documentUploadValidator";
import { getKey } from "@framework/util";
import { Results } from "../../validation/results";

export const documentStore = "documents";
export const documentSummaryEditorStore = "documentSummary";

export const getProjectDocumentEditor = (projectId: string) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto, store) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, store.config, true, false)),
  getKey("project", projectId)
);

export const getClaimDetailDocumentEditor = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey, config: { maxFileSize: number, maxUploadFileCount: number }) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, config, true, false)),
  getKey("claim", "details", partnerId, periodId, costCategoryId)
);

export const getClaimDetailDocumentDeleteEditorStoreInfo = ({ partnerId, periodId, costCategoryId }: ClaimDetailKey, documents: DocumentSummaryDto[]) => {
  return getDocumentsDeleteEditor(getKey("claimDetail", partnerId, periodId, costCategoryId), documents);
};

const getDocumentsDeleteEditor = (key: string, documents: DocumentSummaryDto[]) => editorStoreHelper<DocumentSummaryDto[], Results<DocumentSummaryDto[]>>(
  documentSummaryEditorStore,
  () => Pending.done(documents),
  () => Pending.done(new Results(documents, false)),
  key
);
