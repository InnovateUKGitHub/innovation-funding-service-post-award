import * as Validation from "./common";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import { getFileExtension, getFileSize } from "@framework/util";
import { FileTypeNotAllowedError } from "@server/repositories";
import { NestedResult } from "@ui/validation";
import { DocumentUploadDto, MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { getAllEnumValues } from "@shared/enumHelper";
import { DocumentDescription } from "@framework/constants";

const permittedFileTypeErrorMessage = (file: IFileWrapper) => {
  return `You cannot upload '${file.fileName}' because it is the wrong file type.`;
};

const fileTooBigErrorMessage = (file: IFileWrapper, maxFileSize: number) => {
  const maxMessage = getFileSize(maxFileSize);
  return `You cannot upload '${file.fileName}' because it must be smaller than ${maxMessage}.`;
};

const fileEmptyErrorMessage = (file: IFileWrapper) => {
  return `You cannot upload '${file.fileName}' because it is empty.`;
};

export class DocumentUploadDtoValidator extends Results<DocumentUploadDto> {
  public readonly description: Result;
  public readonly file: Result;
  constructor(model: DocumentUploadDto, config: { maxFileSize: number, permittedFileTypes: string[] }, showValidationErrors: boolean, private readonly error: FileTypeNotAllowedError | null) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);

    this.file = Validation.all(this,
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () => Validation.isTrue(this, model.file!.size <= config.maxFileSize, fileTooBigErrorMessage(model.file!, config.maxFileSize)),
      () => Validation.isFalse(this, model.file!.size === 0, fileEmptyErrorMessage(model.file!)),
      () => Validation.permitedValues(this, getFileExtension(model.file), config.permittedFileTypes, permittedFileTypeErrorMessage(model.file!)),
    );
    this.description = model.description ? Validation.permitedValues(this, model.description, getAllEnumValues(DocumentDescription), "Not a valid description") : Validation.valid(this);
  }
}

export class MultipleDocumentUpdloadDtoValidator extends Results<MultipleDocumentUploadDto> {
  public readonly description: Result;
  constructor(model: MultipleDocumentUploadDto, config: { maxFileSize: number, maxUploadFileCount: number, permittedFileTypes: string[] }, filesRequired: boolean, showValidationErrors: boolean, private readonly error: FileTypeNotAllowedError | null) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);

    this.files = this.validateFiles(model, config, filesRequired);
    this.description = model.description ? Validation.permitedValues(this, model.description, getAllEnumValues(DocumentDescription), "Not a valid description") : Validation.valid(this);
  }

  private validateFiles(model: MultipleDocumentUploadDto, config: { maxFileSize: number, maxUploadFileCount: number, permittedFileTypes: string[] }, filesRequired: boolean, ) {
    const filteredFiles = model.files && model.files.filter(x => x.fileName || x.size) || [];

    const maxCountMessage = config.maxUploadFileCount === 1 ? "You can only select one file at a time." : `You can only select up to ${config.maxUploadFileCount} files at the same time.`;

    return Validation.child(
      this,
      model.files,
      x => new FileDtoValidator(x, config.maxFileSize, config.permittedFileTypes, this.showValidationErrors),
      children => children.all(
        () => filesRequired ? children.isTrue(x => !!(filteredFiles && filteredFiles.length), "Select a file to upload.") : children.valid(),
        () => children.isTrue(x => x.length <= config.maxUploadFileCount, maxCountMessage)
      ),
      filteredFiles.length === 1 ? "Your file cannot be uploaded." : "One or more of your files cannot be uploaded."
    );
  }

  public readonly files: NestedResult<FileDtoValidator>;
}

export class FileDtoValidator extends Results<IFileWrapper> {
  constructor(model: IFileWrapper, maxFileSize: number, permittedFileTypes: string[], showValidationErrors: boolean) {
    // file is deliberately not a private field so it isn't logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);

    if (!model.fileName && !model.size) {
      this.file = Validation.valid(this);
    }
    else {
      this.file = Validation.all(this,
        () => Validation.required(this, model && model.fileName, "Select a file to upload."),
        () => Validation.isTrue(this, model.size <= maxFileSize, fileTooBigErrorMessage(model, maxFileSize)),
        () => Validation.isFalse(this, model.size === 0, fileEmptyErrorMessage(model)),
        () => Validation.permitedValues(this, getFileExtension(model), permittedFileTypes, permittedFileTypeErrorMessage(model)),
      );
    }
  }

  public readonly file: Result;
}
