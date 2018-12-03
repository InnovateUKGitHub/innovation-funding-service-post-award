import * as Validation from "./common";
import { Results } from "../validation/results";
import { isNumber } from "../../util/NumberHelper";

export class ClaimLineItemDtosValidator extends Results<ClaimLineItemDto[]> {
    public readonly items = Validation.optionalChild(this, this.model, x => new ClaimLineItemDtoValidator(x, this.showValidationErrors), "There are invalid claim line items.");
}

export class ClaimLineItemDtoValidator extends Results<ClaimLineItemDto> {
  public description = isNumber(this.model.value)
    ? Validation.required(this, this.model.description, "enter a description.")
    : Validation.valid(this);

  public cost = Validation.all(this,
    () => typeof this.model.description === "string" && this.model.description.length > 0
      ? Validation.required(this, this.model.value, "enter a cost.")
      : Validation.valid(this),
    () => Validation.isCurrency(this, this.model.value, "enter a valid amount."),
    () => Validation.isTrue(this, this.model.value === undefined || this.model.value === null || this.model.value > 0, "enter a valid cost.")
  );
}
