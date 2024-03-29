import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IClientUser } from "@framework/types/IUser";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { removeMessages, messageSuccess } from "../actions/common/messageActions";
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
      this.queue(removeMessages());
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
