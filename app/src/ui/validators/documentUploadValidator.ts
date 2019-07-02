import * as Validation from "./common";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import { getFileSize } from "@framework/util";

export class DocumentUploadDtoValidator extends Results<DocumentUploadDto> {
  constructor(model: DocumentUploadDto, maxFileSize: number, showValidationErrors: boolean) {
    // file is deliberatly not a private field so it isnt logged....
    // model is empty object for this reason
    super(null as any, showValidationErrors);
    const maxMessage = getFileSize(maxFileSize);
    this.file = Validation.all(this,
      () => Validation.required(this, model && model.file && model.file.fileName, "Choose a file to upload."),
      () => Validation.isTrue(this, model.file!.size <= maxFileSize, `File is too big. Please upload a file less than ${maxMessage}.`),
      () => Validation.isFalse(this, model.file!.size === 0, `File is empty. Please check the file you are uploading.`),
    );
  }

  public readonly file: Result;
}
