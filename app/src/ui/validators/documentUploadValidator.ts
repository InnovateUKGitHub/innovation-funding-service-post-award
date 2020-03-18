import * as Validation from "./common";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import { getFileExtension, getFileSize } from "@framework/util";
import { FileTypeNotAllowedError } from "@server/repositories";
import { NestedResult } from "@ui/validation";
import { flatten } from "@framework/util/arrayHelpers";

const permittedFileTypeErrorMessage = (file: IFileWrapper) => {
  return `'${file.fileName}' is the wrong file type.\nYou can upload these file types: PDF (pdf, xps), text (doc, docx, rdf, txt, csv, odt), presentation (ppt, pptx, odp), spreadsheet (xls, xlsx, ods), or image (jpg, jpeg or png).`;
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
      () => Validation.permitedValues(this, getFileExtension(model.file), config.permittedFileTypes, permittedFileTypeErrorMessage(model.file!)),
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
    const filteredFiles = model.files && model.files.filter(x => x.fileName || x.size) || [];

    const childResults = filteredFiles.map(x => new FileDtoValidator(x, config.maxFileSize, config.permittedFileTypes, this.showValidationErrors));
    const childError = childResults.filter(x => !x.isValid).map(x => x.file.errorMessage)[0] || (filteredFiles.length === 1 ? "You cannot upload this file" : "You cannot upload one or more of these files");

    const maxCountMessage = config.maxUploadFileCount === 1 ? "You can only select one file at a time." : `You can only select up to ${config.maxUploadFileCount} files at the same time.`;

    return Validation.child(
      this,
      model.files,
      x => new FileDtoValidator(x, config.maxFileSize, config.permittedFileTypes, this.showValidationErrors),
      children => children.all(
        () => filesRequired ? children.isTrue(x => !!(filteredFiles && filteredFiles.length), "Select a file to upload.") : children.valid(),
        () => children.isTrue(() => !this.error, childError),
        () => children.isTrue(x => x.length <= config.maxUploadFileCount, maxCountMessage)
      ),
      childError
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
        () => Validation.isTrue(this, model.size <= maxFileSize, `'${model.fileName}' must be smaller than ${maxMessage}.`),
        () => Validation.isFalse(this, model.size === 0, `'${model.fileName}' is empty.`),
        () => Validation.permitedValues(this, getFileExtension(model), permittedFileTypes, permittedFileTypeErrorMessage(model)),
      );
    }
  }

  public readonly file: Result;
}
