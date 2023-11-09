import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { isNumber } from "@framework/util/numberHelper";
import { Results } from "../results";
import * as Validation from "./common";

export const claimDetailsCommentsMaxLength = 32768;
export const claimLineItemDescriptionMaxLength = 250;

export class ClaimDetailsValidator extends Results<ClaimDetailsDto> {
  public readonly items = Validation.optionalChild(
    this,
    this.model.lineItems,
    x => new ClaimLineItemDtoValidator({ model: x, showValidationErrors: this.showValidationErrors }),
    this.getContent(x => x.validation.claimDetailsValidator.claimLineItemsInvalid),
  );

  public readonly comments = Validation.maxLength(
    this,
    this.model.comments,
    claimDetailsCommentsMaxLength,
    this.getContent(x => x.validation.claimDetailsValidator.comments_too_big({ count: claimDetailsCommentsMaxLength })),
  );
}

export class ClaimLineItemDtoValidator extends Results<ClaimLineItemDto> {
  public description = Validation.all(
    this,
    () =>
      isNumber(this.model.value)
        ? Validation.required(
            this,
            this.model.description,
            this.getContent(x => x.validation.claimLineItemDtoValidator.descriptionRequired),
          )
        : Validation.valid(this),
    () =>
      Validation.maxLength(
        this,
        this.model.description,
        claimLineItemDescriptionMaxLength,
        this.getContent(x =>
          x.validation.claimLineItemDtoValidator.description_too_big({ count: claimLineItemDescriptionMaxLength }),
        ),
      ),
  );

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
