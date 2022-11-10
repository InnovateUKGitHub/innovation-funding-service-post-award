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
import { Logger } from "@shared/developmentLogger";

const invalidCharacterInFileName = (fileName: string) => {
  return `You cannot upload '${fileName}' because it contains forbidden characters.`;
};

const permittedFileTypeErrorMessage = (file: IFileWrapper | null) => {
  return `You cannot upload '${file?.fileName}' because it is the wrong file type.`;
};

const fileTooBigErrorMessage = (file: IFileWrapper | null, maxFileSize: number) => {
  const maxMessage = getFileSize(maxFileSize);
  return `You cannot upload '${file?.fileName}' because it must be smaller than ${maxMessage}.`;
};

const fileEmptyErrorMessage = (file: IFileWrapper | null) => {
  return `You cannot upload '${file?.fileName}' because it is empty.`;
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
    super(null, showValidationErrors);

    this.file = Validation.all(
      this,
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () => validateFileName(this, model && model.file),
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () =>
        Validation.isTrue(
          this,
          (model.file?.size ?? 0) <= config.maxFileSize,
          fileTooBigErrorMessage(model?.file, config.maxFileSize),
        ),
      () => Validation.isFalse(this, model?.file?.size === 0, fileEmptyErrorMessage(model?.file)),
      () => validateFileExtension(this, model.file, config.permittedFileTypes),
    );
    this.description = model.description
      ? Validation.permittedValues(
          this,
          model.description,
          getAllNumericalEnumValues(DocumentDescription),
          "Not a valid description",
        )
      : Validation.valid(this);
  }
}

export class MultipleDocumentUploadDtoValidator extends Results<MultipleDocumentUploadDto> {
  private readonly logger: Logger = new Logger("MultipleDocumentUploadDtoValidator");

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
    super(null, showValidationErrors);

    this.files = this.validateFiles(model, config, filesRequired);
    this.description = model.description
      ? Validation.permittedValues(
          this,
          model.description,
          getAllNumericalEnumValues(DocumentDescription),
          "Not a valid description",
        )
      : Validation.valid(this);
    this.partnerId = Validation.valid(this);
  }

  private validateFiles(model: MultipleDocumentUploadDto, config: IAppOptions, filesRequired: boolean) {
    const filteredFiles = (model.files && model.files.filter(x => x.fileName || x.size)) || [];
    const maxUploadFileCount = config.maxUploadFileCount;

    const maxCountMessage =
      maxUploadFileCount === 1
        ? "You can only select one file at a time."
        : `You can only select up to ${maxUploadFileCount} files at the same time.`;

    return Validation.child(
      this,
      model.files,
      x => new FileDtoValidator(x, config, this.showValidationErrors),
      children =>
        children.all(
          () =>
            filesRequired
              ? children.isTrue(() => !!(filteredFiles && filteredFiles.length), "Select a file to upload.")
              : children.valid(),
          () => children.isTrue(x => x.length <= maxUploadFileCount, maxCountMessage),
        ),
      filteredFiles.length === 1 ? "Your file cannot be uploaded." : "One or more of your files cannot be uploaded.",
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
    super(null, showValidationErrors);

    this.file = Validation.all(
      this,
      () => Validation.required(this, file.fileName, "Select a file to upload."),
      () => validateFileName(this, file),
      () => Validation.isTrue(this, file.size <= maxFileSize, fileTooBigErrorMessage(file, maxFileSize)),
      () => Validation.isFalse(this, file.size === 0, fileEmptyErrorMessage(file)),
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
  permittedFileTypes: string[],
): Result {
  const fileName = file ? file.fileName : "";
  return Validation.permittedValues(
    results,
    getFileExtension(fileName),
    permittedFileTypes,
    permittedFileTypeErrorMessage(file),
  );
}

/**
 * validates file name
 */
function validateFileName<T extends Results<ResultBase>>(results: T, file: IFileWrapper | null): Result {
  // TODO: this needs to be moved to config
  const validCharacters = /^[\w\d\s\\.\-()]+$/;

  if (!file) {
    return Validation.inValid(results, "File does not exist");
  } else {
    const fileName = file.fileName;
    const name = getFileName(fileName);

    const hasValidName: boolean = validCharacters.test(name);
    return Validation.isTrue(results, hasValidName, invalidCharacterInFileName(fileName));
  }
}
