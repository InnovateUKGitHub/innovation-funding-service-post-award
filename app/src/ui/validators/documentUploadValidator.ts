import { FileTypeNotAllowedError } from "@server/repositories";
import { NestedResult } from "@ui/validation";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { DocumentDescription } from "@framework/constants";
import { IAppOptions } from "@framework/types/IAppOptions";
import { IFileWrapper } from "@framework/types";
import { getFileExtension, getFileName, getFileSize } from "@framework/util";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import * as Validation from "./common";

const invalidCharacterInFileName = <T extends Results<ResultBase>>(results: T, fileName: string) => {
  return results.getContent(x => x.validation.documentValidator.nameInvalidCharacters({ name: fileName }));
};

const permittedFileTypeErrorMessage = <T extends Results<ResultBase>>(results: T, file: IFileWrapper | null) => {
  return results.getContent(x => x.validation.documentValidator.fileTypeInvalid({ name: file?.fileName }));
};

const fileTooBigErrorMessage = <T extends Results<ResultBase>>(
  results: T,
  file: IFileWrapper | null,
  maxFileSize: number,
) => {
  const maxMessage = getFileSize(maxFileSize);
  return results.getContent(x =>
    x.validation.documentValidator.fileSizeTooLarge({ name: file?.fileName, size: maxMessage }),
  );
};

const fileEmptyErrorMessage = <T extends Results<ResultBase>>(results: T, file: IFileWrapper | null) => {
  return results.getContent(x => x.validation.documentValidator.fileSizeEmpty({ name: file?.fileName }));
};

// TODO: investigate better solution to passing in null to supers, preferably by passing in the model.
// Avoided as part of ACC-8996 because wishing to avoid actual code changes in this PR

export class DocumentUploadDtoValidator extends Results<DocumentUploadDto> {
  public readonly description: Result;
  public readonly file: Result;
  constructor(model: DocumentUploadDto, config: IAppOptions, showValidationErrors: boolean) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    super({ model: null, showValidationErrors });

    this.file = Validation.all(
      this,
      () =>
        Validation.required(
          this,
          model && model.file && model.file.fileName,
          this.getContent(x => x.validation.documentValidator.fileRequired),
        ),
      () => validateFileName(this, model && model.file),
      () =>
        Validation.required(
          this,
          model && model.file && model.file.fileName,
          this.getContent(x => x.validation.documentValidator.fileRequired),
        ),
      () =>
        Validation.isTrue(
          this,
          (model.file?.size ?? 0) <= config.maxFileSize,
          fileTooBigErrorMessage(this, model?.file, config.maxFileSize),
        ),
      () => Validation.isFalse(this, model?.file?.size === 0, fileEmptyErrorMessage(this, model?.file)),
      () => validateFileExtension(this, model.file, config.permittedFileTypes),
    );
    this.description = model.description
      ? Validation.permittedValues(
          this,
          model.description,
          getAllNumericalEnumValues(DocumentDescription),
          this.getContent(x => x.validation.documentValidator.fileDescriptionInvalid),
        )
      : Validation.valid(this);
  }
}

export class MultipleDocumentUploadDtoValidator extends Results<MultipleDocumentUploadDto> {
  public readonly description: Result;
  public readonly partnerId: Result;

  constructor(
    model: MultipleDocumentUploadDto,
    config: IAppOptions,
    filesRequired: boolean,
    showValidationErrors: boolean,
    private readonly error: FileTypeNotAllowedError | null,
  ) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    super({ model: null, showValidationErrors });

    this.files = this.validateFiles(model, config, filesRequired);
    this.description = model.description
      ? Validation.permittedValues(
          this,
          model.description,
          getAllNumericalEnumValues(DocumentDescription),
          this.getContent(x => x.validation.documentValidator.fileDescriptionInvalid),
        )
      : Validation.valid(this);
    this.partnerId = Validation.valid(this);
  }

  private validateFiles(model: MultipleDocumentUploadDto, config: IAppOptions, filesRequired: boolean) {
    const filteredFiles = (model.files && model.files.filter(x => x.fileName || x.size)) || [];
    const maxUploadFileCount = config.maxUploadFileCount;

    return Validation.child(
      this,
      model.files,
      x => new FileDtoValidator(x, config, this.showValidationErrors),
      children =>
        children.all(
          () =>
            filesRequired
              ? children.isTrue(
                  () => !!(filteredFiles && filteredFiles.length),
                  this.getContent(x => x.validation.documentValidator.fileRequired),
                )
              : children.valid(),
          () =>
            children.isTrue(
              x => x.length <= maxUploadFileCount,
              this.getContent(x => x.validation.documentValidator.fileCountTooLarge({ count: maxUploadFileCount })),
            ),
        ),
      this.getContent(x => x.validation.documentValidator.fileUploadFailure),
    );
  }

  public readonly files: NestedResult<FileDtoValidator>;
}

export class FileDtoValidator extends Results<IFileWrapper> {
  // TODO: when this branch is merged with the odg branch, we should take in one config options instead of maxFileSize/permittedFileTypes
  constructor(file: IFileWrapper, { maxFileSize, permittedFileTypes }: IAppOptions, showValidationErrors: boolean) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    super({ model: null, showValidationErrors });

    this.file = Validation.all(
      this,
      () =>
        Validation.required(
          this,
          file.fileName,
          this.getContent(x => x.validation.documentValidator.fileRequired),
        ),
      () => validateFileName(this, file),
      () => Validation.isTrue(this, file.size <= maxFileSize, fileTooBigErrorMessage(this, file, maxFileSize)),
      () => Validation.isFalse(this, file.size === 0, fileEmptyErrorMessage(this, file)),
      () => validateFileExtension(this, file, permittedFileTypes),
    );
  }

  public readonly file: Result;
}
/**
 * validates file extension
 */
function validateFileExtension<T extends Results<ResultBase>>(
  results: T,
  file: IFileWrapper | null,
  permittedFileTypes: Readonly<string[]>,
): Result {
  const fileName = file ? file.fileName : "";
  return Validation.permittedValues(
    results,
    getFileExtension(fileName),
    permittedFileTypes,
    permittedFileTypeErrorMessage(results, file),
  );
}

/**
 * validates file name
 */
function validateFileName<T extends Results<ResultBase>>(results: T, file: IFileWrapper | null): Result {
  const validCharacters = /^[\w\d\s\\.\-()]+$/;

  if (!file) {
    return Validation.inValid(
      results,
      results.getContent(x => x.validation.documentValidator.fileMissing),
    );
  } else {
    const fileName = file.fileName;
    const name = getFileName(fileName);

    const hasValidName: boolean = validCharacters.test(name);
    return Validation.isTrue(results, hasValidName, invalidCharacterInFileName(results, fileName));
  }
}
