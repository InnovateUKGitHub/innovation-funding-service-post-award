import { Results } from "@ui/validation/results";
import * as Validation from "./common";
import { CostCategoryVirementDto, FinancialVirementDto, PartnerVirementsDto } from "@framework/dtos";

export class FinancialVirementDtoValidator extends Results<FinancialVirementDto> {

  constructor(model: FinancialVirementDto, showValidationErrors: boolean, private readonly submit: boolean) {
    super(model, showValidationErrors);
  }

  public readonly partners = Validation.optionalChild(this, this.model.partners, x => new PartnerVirementsDtoValidator(x, this.showValidationErrors));

  // TODO: we are validating this on the partner now, but it still needs to be untangled from the UI at a later date
  public readonly newRemainingGrant = Validation.all(this,
    () => Validation.required(this, this.model.newRemainingGrant),
    () => this.submit ? Validation.isTrue(this, (this.model.newRemainingGrant <= this.model.originalRemainingGrant), "The total grant cannot exceed the remaining grant") : Validation.valid(this),
  );
}

export class PartnerVirementsDtoValidator extends Results<PartnerVirementsDto> {
  public readonly virements = Validation.optionalChild(this, this.model.virements, x => new CostCategoryVirementDtoValidator(x, this.showValidationErrors));

  public readonly newRemainingGrant = Validation.all(this,
    () => Validation.required(this, this.model.newRemainingGrant, "New remaining grant is required"),
    () => Validation.isTrue(this, this.model.newRemainingGrant <= this.model.originalRemainingGrant, "The total grant cannot exceed the remaining grant"),
    () => Validation.isTrue(this, this.model.newRemainingGrant >= 0, `Grant cannot be less zero`),
  );
}

export class CostCategoryVirementDtoValidator extends Results<CostCategoryVirementDto> {

  public readonly newPartnerEligibleCosts = Validation.all(this,
    () => Validation.required(this, this.model.newEligibleCosts, "Costs are required"),
    () => Validation.isTrue(this, this.model.newEligibleCosts >= this.model.costsClaimedToDate, `Costs cannot be less than amount already claimed for ${this.model.costCategoryName}`),
    () => Validation.isTrue(this, this.model.newEligibleCosts >= 0, `Costs cannot be less zero`),
  );
}
