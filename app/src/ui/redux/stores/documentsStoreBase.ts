import { scrollToTheTopSmoothly } from "@framework/util";
import { DocumentUploadDtoValidator, MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { IClientUser } from "@framework/types";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { messageSuccess } from "../actions";
import { StoreBase } from "./storeBase";

export abstract class DocumentsStoreBase extends StoreBase {
  protected validateMultipleDocumentsDto(dto: MultipleDocumentUploadDto, showErrors: boolean, filesRequired: boolean) {
    return new MultipleDocumentUploadDtoValidator(dto, this.getState().config.options, filesRequired, showErrors, null);
  }

  protected validateDocumentUploadDto(dto: DocumentUploadDto, showErrors: boolean) {
    return new DocumentUploadDtoValidator(dto, this.getState().config.options, showErrors);
  }

  protected afterUpdate(key: string, message: string | undefined, onComplete: (() => void) | undefined) {
    this.resetEditor("multipleDocuments", key, { files: [] });

    // Reload both documents and partnerDocuments
    this.markStale("documents", key, undefined);
    this.markStale("partnerDocuments", key, undefined);

    if (message) {
      this.queue(messageSuccess(message));
      scrollToTheTopSmoothly();
    }
    if (onComplete) {
      onComplete();
    }
  }

  private afterError(key: string) {
    setTimeout(() => {
      // Reload both documents and partnerDocuments
      this.markStale("documents", key, undefined);
      this.markStale("partnerDocuments", key, undefined);
    });
  }

  protected updateMultiple(
    saving: boolean,
    filesRequired: boolean,
    key: string,
    dto: MultipleDocumentUploadDto,
    callUpdateApi: (p: {
      user: IClientUser;
      documents: MultipleDocumentUploadDto;
    }) => Promise<{ documentIds: string[] }>,
    message: string | undefined,
    onComplete: (() => void) | undefined,
  ) {
    this.updateEditor(
      saving,
      "multipleDocuments",
      key,
      dto,
      show => this.validateMultipleDocumentsDto(dto, show, filesRequired),
      p => (dto.files.length ? callUpdateApi({ documents: dto, ...p }) : Promise.resolve(null)),
      () => this.afterUpdate(key, dto.files.length ? message : undefined, onComplete),
      () => this.afterError(key),
    );
  }
}
