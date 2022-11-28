import { scrollToTheTopSmoothly } from "@framework/util";
import { MultipleDocumentUploadDtoValidator } from "@ui/validators";
import { IClientUser } from "@framework/types";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { messageSuccess } from "../actions";
import { StoreBase } from "./storeBase";

export abstract class DocumentsStoreBase extends StoreBase {
  protected validateMultipleDocumentsDto(dto: MultipleDocumentUploadDto, showErrors: boolean, filesRequired: boolean) {
    return new MultipleDocumentUploadDtoValidator(dto, this.getState().config.options, filesRequired, showErrors, null);
  }

  protected afterUpdate(
    key: string,
    message: string | undefined,
    filesRequired: boolean,
    onComplete: (() => void) | undefined,
  ) {
    const newDto = { files: [] };

    // Create a reset call, initialising the key to an empty DTO and a hidden validator.
    this.resetEditor("multipleDocuments", key, newDto, () =>
      this.validateMultipleDocumentsDto(newDto, false, filesRequired),
    );

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
      () => this.afterUpdate(key, dto.files.length ? message : undefined, filesRequired, onComplete),
      () => this.afterError(key),
    );
  }
}
