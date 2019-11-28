import { StoreBase } from "./storeBase";
import { scrollToTheTopSmoothly } from "@framework/util";
import { DocumentUploadDtoValidator, MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { messageSuccess } from "../actions";
import { DataStateKeys, EditorStateKeys } from "../reducers";

export abstract class DocumentsStoreBase extends StoreBase {

  protected validateMultipleDocumentsDto(dto: MultipleDocumentUploadDto, showErrors: boolean, filesRequired: boolean = true) {
    return new MultipleDocumentUpdloadDtoValidator(dto, this.getState().config, filesRequired, showErrors);
  }

  protected validateDocumentUploadDto(dto: DocumentUploadDto, showErrors: boolean) {
    return new DocumentUploadDtoValidator(dto, this.getState().config.maxFileSize, showErrors);
  }

  protected afterUpdate(dataStore: DataStateKeys, editorStore: EditorStateKeys, key: string, message: string | undefined, onComplete: (() => void) | undefined) {
    this.resetEditor(editorStore, key);
    this.markStale(dataStore, key, undefined);
    if (message) {
      this.queue(messageSuccess(message));
      scrollToTheTopSmoothly();
    }
    if (onComplete) {
      onComplete();
    }
  }
}
