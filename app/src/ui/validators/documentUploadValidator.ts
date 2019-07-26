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
  constructor(model: MultipleDocumentUploadDto, maxFileSize: number, maxNumberOfFiles: number, showValidationErrors: boolean) {
    // file is deliberatly not a private field so it isnt logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    this.files = Validation.requiredChild(this, model.files, x => new FileDtoValidator(x, maxFileSize, this.showValidationErrors));
    const filteredFiles = model.files && model.files.filter(x => x.fileName || x.size);
    this.fileCount = Validation.all(this,
      () => Validation.isTrue(this, filteredFiles.length > 0, `Please select a file to upload`),
      () => Validation.isTrue(this, filteredFiles.length < maxNumberOfFiles, `Please upload less than ${maxNumberOfFiles} files`)
    );
  }

  public readonly fileCount: Result;
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
        () => Validation.required(this, model && model.fileName, "Choose a file to upload."),
        () => Validation.isTrue(this, model.size <= maxFileSize, `The selected file must be smaller than ${maxMessage}.`),
        () => Validation.isFalse(this, model.size === 0, `File is empty. Please check the file you have selected.`),
      );
    }
  }

  public readonly file: Result;
}
