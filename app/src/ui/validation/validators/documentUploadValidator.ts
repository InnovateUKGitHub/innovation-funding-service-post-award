import { Results } from "../results";
import { Result } from "../result";
import * as Validation from "./common";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { IFileWrapper } from "@framework/types/fileWrapper";
import { IAppOptions } from "@framework/types/IAppOptions";
import { getFileSize } from "@framework/util/files";
import { FileTypeNotAllowedError } from "@server/repositories/errors";
import { getAllNumericalEnumValues } from "@shared/enumHelper";
import { NestedResult } from "@ui/validation/nestedResult";
import { filenameValidator } from "@ui/zod/helperValidators/filenameValidator.zod";
import { makeZodI18nMap } from "@shared/zodi18n";

export const validDocumentFilenameCharacters = /^[\w\d\s\\.\-()]+$/;

const fileTooBigErrorMessage = <T extends Results<ResultBase>>(
  results: T,
  file: IFileWrapper | null,
  { maxFileSize }: Pick<IAppOptions, "maxFileSize">,
) => {
  const maxMessage = getFileSize(maxFileSize);
  return results.getContent(x =>
    x.validation.documentValidator.fileSizeTooLarge({ name: file?.fileName, size: maxMessage }),
  );
};

const fileEmptyErrorMessage = <T extends Results<ResultBase>>(results: T, file: IFileWrapper | null) => {
  return results.getContent(x => x.validation.documentValidator.fileSizeEmpty({ name: file?.fileName }));
};
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
              files => {
                let anyFileTooBig = false;
                let total = 0;

                for (const file of files) {
                  total += file.size;

                  if (file.size > config.maxTotalFileSize) {
                    anyFileTooBig = true;
                    break;
                  }
                }

                if (files.length <= 1) return true;
                if (anyFileTooBig) return true;
                return total <= config.maxTotalFileSize;
              },
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
  constructor(file: IFileWrapper, options: IAppOptions, showValidationErrors: boolean) {
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
          file,
          this.getContent(x => x.validation.documentValidator.fileRequired),
        ),
      () => validateFileName(this, file, options),
      () => Validation.isTrue(this, file.size <= options.maxFileSize, fileTooBigErrorMessage(this, file, options)),
      () => Validation.isFalse(this, file.size === 0, fileEmptyErrorMessage(this, file)),
    );
  }

  public readonly file: Result;
}

const errorMap = makeZodI18nMap({ keyPrefix: ["documents", "files", "arrayType", "fileName"] });
/**
 * validates file name
 */
function validateFileName<T extends Results<ResultBase>>(
  results: T,
  file: IFileWrapper | null,
  options: IAppOptions,
): Result {
  const result = filenameValidator(options).safeParse(file?.fileName, { errorMap });

  if (result.error) {
    return Validation.inValid(results, result.error?.issues[0].message);
  }

  return Validation.valid(results);
}
