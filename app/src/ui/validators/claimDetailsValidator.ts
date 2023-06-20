import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { isNumber } from "@framework/util/numberHelper";
import { Results } from "../validation/results";
import * as Validation from "./common";

export class ClaimDetailsValidator extends Results<ClaimDetailsDto> {
  public readonly items = Validation.optionalChild(
    this,
    this.model.lineItems,
    x => new ClaimLineItemDtoValidator({ model: x, showValidationErrors: this.showValidationErrors }),
    this.getContent(x => x.validation.claimDetailsValidator.claimLineItemsInvalid),
  );
}

export class ClaimLineItemDtoValidator extends Results<ClaimLineItemDto> {
  public description = isNumber(this.model.value)
    ? Validation.required(
        this,
        this.model.description,
        this.getContent(x => x.validation.claimLineItemDtoValidator.descriptionRequired),
      )
    : Validation.valid(this);

  public cost = Validation.all(
    this,
    () =>
      typeof this.model.description === "string" && this.model.description.length > 0
        ? Validation.required(
            this,
            this.model.value,
            this.getContent(x => x.validation.claimLineItemDtoValidator.costRequired),
          )
        : Validation.valid(this),
    () =>
      Validation.isCurrency(
        this,
        this.model.value,
        this.getContent(x => x.validation.claimLineItemDtoValidator.costMustBeCurrency),
      ),
  );
}
