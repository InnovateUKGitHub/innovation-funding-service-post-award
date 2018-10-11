import { ClaimLineItemDto } from "../models";
import * as Validation from "./common";
import { Results } from "../validation/results";

export class ClaimLineItemDtosValidator extends Results<ClaimLineItemDto[]> {
    public readonly items = Validation.requiredChild(this, this.model, x => new ClaimLineItemDtoValidator(x, this.showValidationErrors), "At least one cost must be entered", "There are invalid cost categories");
}

export class ClaimLineItemDtoValidator extends Results<ClaimLineItemDto> {

    public description = Validation.required(this, this.model.description, "Enter a description for the cost");

    public cost = Validation.all(this,
        () => Validation.required(this, this.model.value, "Enter a cost"),
        () => Validation.isCurrency(this, this.model.value, "Enter a valid amount"),
        () => Validation.isTrue(this, this.model.value! > 0, "Enter a valid cost"),
        );
}
