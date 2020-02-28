import { Results } from "@ui/validation/results";
import * as Validation from "./common";

export class FinancialVirementDtoValidator extends Results<FinancialVirementDto> {
  public readonly partners = Validation.optionalChild(this, this.model.partners, x => new PartnerVirementsDtoValidator(x, this.showValidationErrors));

  public readonly newRemainingGrant = Validation.all(this,
    () => Validation.required(this, this.model.newRemainingGrant),
    () => Validation.isCurrency(this, this.model.newRemainingGrant),
    () => Validation.isTrue(this, this.model.newRemainingGrant <= this.model.originalRemainingGrant, "The total grant cannot exceed the remaining grant")
  );
}

export class PartnerVirementsDtoValidator extends Results<PartnerVirementsDto> {
  public readonly virements = Validation.optionalChild(this, this.model.virements, x => new CostCategoryVirementDtoValidator(x, this.showValidationErrors));

  public readonly newRemainingGrant = Validation.all(this,
    () => Validation.required(this, this.model.newRemainingGrant, "New remaining grant is required"),
    () => Validation.isCurrency(this, this.model.newRemainingGrant, "Costs must be a number."),
    () => Validation.isTrue(this, this.model.newRemainingGrant <= this.model.newRemainingCosts, `New remaining grant cannot be greater than remaining costs`),
    () => Validation.isTrue(this, this.model.newRemainingGrant >= 0, `Costs cannot be less zero`),
  );
}

export class CostCategoryVirementDtoValidator extends Results<CostCategoryVirementDto> {
  public readonly newEligibleCosts = Validation.all(this,
    () => Validation.required(this, this.model.newEligibleCosts, "Costs are required"),
    () => Validation.isCurrency(this, this.model.newEligibleCosts, "Costs must be a number."),
    () => Validation.isTrue(this, this.model.newEligibleCosts >= this.model.costsClaimedToDate, `Costs cannot be less than amount already claimed for ${this.model.costCategoryName}`)
  );
}
