import * as Validation from "./common";
import { Results } from "../validation/results";
import { FileUpload } from "@framework/types/FileUpload";

export class DocumentUploadValidator extends Results<DocumentUploadDto> {
  public readonly file = Validation.required(this, this.model.file, "Choose a file to upload.");
}

export class FileUploadValidator extends Results<FileUpload> {
  public readonly file = Validation.required(this, this.model.fileName, "Choose a file to upload.");
}
