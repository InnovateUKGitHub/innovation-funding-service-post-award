import * as Validation from "./common";
import { Results } from "../validation/results";
import { PartnerDto } from "@framework/dtos";

export class PartnerDtoValidator extends Results<PartnerDto> {
    public postcode = Validation.all(this,
        () => !this.model.postcode ? Validation.required(this, this.model.postcode, "Postcode field cannot be empty") : Validation.valid(this)
    );
}
