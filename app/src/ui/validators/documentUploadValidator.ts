import * as Validation from "./common";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import { getFileSize } from "@framework/util";
import { NestedResult } from "@ui/validation";

export class DocumentUploadDtoValidator extends Results<DocumentUploadDto> {
  constructor(model: DocumentUploadDto, maxFileSize: number, showValidationErrors: boolean) {
    // file is deliberatly not a private field so it isnt logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    const maxMessage = getFileSize(maxFileSize);
    this.file = Validation.all(this,
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () => Validation.isTrue(this, model.file!.size <= maxFileSize, `The selected file must be smaller than ${maxMessage}.`),
      () => Validation.isFalse(this, model.file!.size === 0, `File is empty. Please check the file you have selected.`),
    );
  }

  public readonly file: Result;
}

export class MultipleDocumentUpdloadDtoValidator extends Results<MultipleDocumentUploadDto> {
  constructor(model: MultipleDocumentUploadDto, config: { maxFileSize: number, maxUploadFileCount: number }, filesRequired: boolean, showValidationErrors: boolean) {
    // file is deliberatly not a private field so it isnt logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    const filesMessage = model.files && model.files.length === 1 ? "The file is invalid." : "A file is invalid.";
    const filteredFiles = model.files && model.files.filter(x => x.fileName || x.size);
    const maxCountMessage = config.maxUploadFileCount === 1 ? "You can only select one file at a time." : `You can only select up to ${config.maxUploadFileCount} files at the same time.`;

    // validate the number of files
    const fileCountValidation = Validation.all(this,
      () => filesRequired ? Validation.isTrue(this, filteredFiles.length > 0, `Select a file to upload.`) : Validation.valid(this),
      () => Validation.isTrue(this, filteredFiles.length <= config.maxUploadFileCount, maxCountMessage)
    );

    this.files = Validation.child(this, model.files, x => new FileDtoValidator(x, config.maxFileSize, this.showValidationErrors), fileCountValidation, filesMessage);
  }

  public readonly files: NestedResult<FileDtoValidator>;
}

export class FileDtoValidator extends Results<IFileWrapper> {
  constructor(model: IFileWrapper, maxFileSize: number, showValidationErrors: boolean) {
    // file is deliberatly not a private field so it isnt logged....
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
      );
    }
  }

  public readonly file: Result;
}
