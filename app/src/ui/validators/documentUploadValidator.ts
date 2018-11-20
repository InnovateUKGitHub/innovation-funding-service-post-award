import * as Validation from "./common";
import { Results } from "../validation/results";

export class DocumentUploadValidator extends Results<DocumentUploadDto> {
  public readonly file = Validation.required(this, this.model.file, "A file is required");
}
