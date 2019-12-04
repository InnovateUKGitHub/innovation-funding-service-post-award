import { editorStoreHelper } from "./common";
import { Pending } from "../../../shared/pending";
import { MultipleDocumentUpdloadDtoValidator } from "../../validators/documentUploadValidator";
import { getKey } from "@ui/redux/stores/storeKeys";

export const getProjectDocumentEditor = (projectId: string) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto, store) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, store.config, true, false)),
  getKey("project", projectId)
);
