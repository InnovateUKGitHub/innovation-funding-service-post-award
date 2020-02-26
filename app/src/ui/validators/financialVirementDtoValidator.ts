import { Results } from "@ui/validation/results";
import * as Validation from "./common";

export class FinancialVirementDtoValidator extends Results<FinancialVirementDto> {
  public readonly partners = Validation.optionalChild(this, this.model.partners, x => new PartnerVirementsDtoValidator(x, this.showValidationErrors));
}

export class PartnerVirementsDtoValidator extends Results<PartnerVirementsDto> {
  public readonly virements = Validation.optionalChild(this, this.model.virements, x => new CostCategoryVirementDtoValidator(x, this.showValidationErrors));
}

export class CostCategoryVirementDtoValidator extends Results<CostCategoryVirementDto> {
  public readonly newEligibleCosts = Validation.all(this,
    () => Validation.required(this, this.model.newEligibleCosts, "Costs are required"),
    () => Validation.isCurrency(this, this.model.newEligibleCosts, "Costs must be a number."),
    () => Validation.isTrue(this, this.model.newEligibleCosts >= this.model.costsClaimedToDate, `Costs cannot be less than amount already claimed for ${this.model.costCategoryName}`)
  );
}
