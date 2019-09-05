import { PCRDto } from "@framework/dtos";
import { Results } from "../validation/results";
import * as Validation from "./common";

export class PCRDtoValidator extends Results<PCRDto> {
  comments = Validation.maxLength(this, this.model.comments, 100, "The comments are too long");
}
