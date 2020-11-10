import * as Validation from "./common";
import { Results } from "../validation/results";
import { isNumber } from "@framework/util";
import { ClaimDetailsDto, ClaimLineItemDto } from "@framework/dtos";

export class ClaimDetailsValidator extends Results<ClaimDetailsDto> {
    public readonly items = Validation.optionalChild(this, this.model.lineItems, x => new ClaimLineItemDtoValidator(x, this.showValidationErrors), "There are invalid claim line items.");
}

export class ClaimLineItemDtoValidator extends Results<ClaimLineItemDto> {
  public description = isNumber(this.model.value)
    ? Validation.required(this, this.model.description, "Enter a description.")
    : Validation.valid(this);

  public cost = Validation.all(this,
    () => typeof this.model.description === "string" && this.model.description.length > 0
      ? Validation.required(this, this.model.value, "Enter a cost.")
      : Validation.valid(this),
    () => Validation.isCurrency(this, this.model.value, "Costs must be a number.")
    );
}
