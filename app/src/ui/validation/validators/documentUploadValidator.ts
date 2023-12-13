import { Results } from "../results";
import { Result } from "../result";
import * as Validation from "./common";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFileWrapper } from "@framework/types/fileWapper";
import { IAppOptions } from "@framework/types/IAppOptions";
import { getFileSize, getFileExtension, getFileName } from "@framework/util/files";
import { FileTypeNotAllowedError } from "@server/repositories/errors";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { NestedResult } from "@ui/validation/nestedResult";
import { sumBy } from "@framework/util/numberHelper";

export const validDocumentFilenameCharacters = /^[\w\d\s\\.\-()]+$/;

const basenameTooLongMessage = <T extends Results<ResultBase>>(results: T, name: string, count: number) => {
  return results.getContent(x => x.validation.documentValidator.fileBasenameTooLong({ name, count }));
};

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
      () => validateFileName(this, model && model.file, config.maxFileBasenameLength),
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
  public readonly files: NestedResult<FileDtoValidator> | Result;

  constructor(
    model: MultipleDocumentUploadDto,
    config: IAppOptions,
    filesRequired: boolean,
    showValidationErrors: boolean,
    private readonly error: FileTypeNotAllowedError | null,
    private readonly impactManagementParticipation: ImpactManagementParticipation = ImpactManagementParticipation.Unknown,
  ) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    super({ model: null, showValidationErrors });

    this.files = this.validateFiles(model, config, filesRequired);
    this.description = model.description
      ? Validation.all(
          this,
          () =>
            Validation.permittedValues(
              this,
              model.description,
              getAllNumericalEnumValues(DocumentDescription),
              this.getContent(x => x.validation.documentValidator.fileDescriptionInvalid),
            ),
          () =>
            this.impactManagementParticipation === ImpactManagementParticipation.Yes
              ? Validation.isTrue(
                  this,
                  model.description !== DocumentDescription.ProjectCompletionForm,
                  this.getContent(
                    x => x.validation.documentValidator.impactManagementParticipationDisallowsProjectCompletionForm,
                  ),
                )
              : Validation.valid(this),
        )
      : Validation.valid(this);
    this.partnerId = Validation.valid(this);
  }

  private validateFiles(model: MultipleDocumentUploadDto, config: IAppOptions, filesRequired: boolean) {
    const filteredFiles = (model.files && model.files.filter(x => x.fileName || x.size)) || [];

    // If there is a multer error (see `formHandlerBase.ts`)
    // use those set of errors instead.
    if (model.multerError) {
      const maxMessage = getFileSize(config.maxFileSize);

      return Validation.all(
        this,
        () =>
          Validation.isFalse(
            this,
            model.multerError === "LIMIT_FILE_COUNT",
            this.getContent(x =>
              x.validation.documentValidator.fileCountTooLarge({ count: config.maxUploadFileCount }),
            ),
          ),
        () =>
          Validation.isFalse(
            this,
            model.multerError === "LIMIT_FILE_SIZE",
            this.getContent(x => x.validation.documentValidator.multerTooLarge({ size: maxMessage })),
          ),
      );
    }

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
              x => x.length <= config.maxUploadFileCount,
              this.getContent(x =>
                x.validation.documentValidator.fileCountTooLarge({ count: config.maxUploadFileCount }),
              ),
            ),
          () =>
            children.isTrue(
              x => sumBy(x, file => file.size) < config.maxTotalFileSize,
              this.getContent(x =>
                x.forms.documents.files.errors.total_size_too_large({ size: config.maxTotalFileSize }),
              ),
            ),
        ),
      this.getContent(x => x.validation.documentValidator.fileUploadFailure({ count: model.files?.length })),
    );
  }
}

export class FileDtoValidator extends Results<IFileWrapper> {
  // TODO: when this branch is merged with the odg branch, we should take in one config options instead of maxFileSize/permittedFileTypes
  constructor(
    file: IFileWrapper,
    { maxFileSize, maxFileBasenameLength, permittedFileTypes }: IAppOptions,
    showValidationErrors: boolean,
  ) {
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
      () => validateFileName(this, file, maxFileBasenameLength),
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
  const extension = getFileExtension(fileName);

  if (extension.length === 0) {
    return Validation.inValid(
      results,
      results.getContent(x => x.validation.documentValidator.fileNameEmpty),
    );
  }

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
function validateFileName<T extends Results<ResultBase>>(
  results: T,
  file: IFileWrapper | null,
  maxFileBasenameLength: number,
): Result {
  if (!file) {
    return Validation.inValid(
      results,
      results.getContent(x => x.validation.documentValidator.fileMissing),
    );
  } else {
    const fileName = file.fileName;
    const name = getFileName(fileName);

    if (name.length === 0) {
      return Validation.inValid(
        results,
        results.getContent(x => x.validation.documentValidator.fileNameEmpty),
      );
    }

    const hasValidName: boolean = validDocumentFilenameCharacters.test(name);
    return Validation.all(
      results,
      () =>
        Validation.isTrue(
          results,
          name.length <= maxFileBasenameLength,
          basenameTooLongMessage(results, fileName, maxFileBasenameLength),
        ),
      () => Validation.isTrue(results, hasValidName, invalidCharacterInFileName(results, fileName)),
    );
  }
}
