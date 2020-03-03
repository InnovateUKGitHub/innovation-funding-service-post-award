import * as Validation from "./common";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import { getFileSize } from "@framework/util";
import { FileTypeNotAllowedError } from "@server/repositories";
import { NestedResult } from "@ui/validation";

const getFileExtension = (file: IFileWrapper | null | undefined) => {
  return file && file.fileName.indexOf(".") >= 0 ? file.fileName.split(".").pop() : "";
};

export class DocumentUploadDtoValidator extends Results<DocumentUploadDto> {
  constructor(model: DocumentUploadDto, config: { maxFileSize: number, permittedFileTypes: string[] }, showValidationErrors: boolean, private error: FileTypeNotAllowedError | null) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    const maxMessage = getFileSize(config.maxFileSize);
    this.file = Validation.all(this,
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () => Validation.isTrue(this, !this.error, "File type is not allowed."),
      () => Validation.isTrue(this, model.file!.size <= config.maxFileSize, `The selected file must be smaller than ${maxMessage}.`),
      () => Validation.isFalse(this, model.file!.size === 0, `File is empty. Please check the file you have selected.`),
      () => Validation.permitedValues(this, getFileExtension(model.file), config.permittedFileTypes, `${model.file!.fileName} is not a permitted file type`),
    );
  }

  public readonly file: Result;
}

export class MultipleDocumentUpdloadDtoValidator extends Results<MultipleDocumentUploadDto> {
  constructor(model: MultipleDocumentUploadDto, config: { maxFileSize: number, maxUploadFileCount: number, permittedFileTypes: string[] }, filesRequired: boolean, showValidationErrors: boolean, private error: FileTypeNotAllowedError | null) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);

    this.files = this.validateFiles(model, config, filesRequired);
  }

  private validateFiles(model: MultipleDocumentUploadDto, config: { maxFileSize: number, maxUploadFileCount: number, permittedFileTypes: string[] }, filesRequired: boolean, ) {
    const filesMessage = model.files && model.files.length === 1 ? "The file is invalid." : "A file is invalid.";
    const filteredFiles = model.files && model.files.filter(x => x.fileName || x.size);
    const maxCountMessage = config.maxUploadFileCount === 1 ? "You can only select one file at a time." : `You can only select up to ${config.maxUploadFileCount} files at the same time.`;

    return Validation.child(
      this,
      model.files,
      x => new FileDtoValidator(x, config.maxFileSize, config.permittedFileTypes, this.showValidationErrors),
      children => children.all(
        () => filesRequired ? children.isTrue(x => !!(filteredFiles && filteredFiles.length), "Select a file to upload.") : children.valid(),
        () => children.isTrue(() => !this.error, "File type is not allowed."),
        () => children.isTrue(x => x.length <= config.maxUploadFileCount, maxCountMessage)
      ),
      filesMessage
    );
  }

  public readonly files: NestedResult<FileDtoValidator>;
}

export class FileDtoValidator extends Results<IFileWrapper> {
  constructor(model: IFileWrapper, maxFileSize: number, permittedFileTypes: string[], showValidationErrors: boolean) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    const maxMessage = getFileSize(maxFileSize);
    if (!model.fileName && !model.size) {
      this.file = Validation.valid(this);
    }
    else {
      this.file = Validation.all(this,
        () => Validation.required(this, model && model.fileName, "Select a file to upload."),
        () => Validation.isTrue(this, model.size <= maxFileSize, `The file must be smaller than ${maxMessage}.`),
        () => Validation.isFalse(this, model.size === 0, `The selected file is empty.`),
        () => Validation.permitedValues(this, getFileExtension(model), permittedFileTypes, `${model.fileName} is not a permitted file type`),
      );
    }
  }

  public readonly file: Result;
}
