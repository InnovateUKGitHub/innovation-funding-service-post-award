import {
  CostCategoryVirementDto,
  FinancialVirementDto,
  FinancialLoanVirementDto,
  PartnerVirementsDto,
} from "@framework/dtos";
import { roundCurrency } from "@framework/util";
import { Results, Result } from "@ui/validation";
import { getCurrency } from "@ui/components/renderers/currency";

import * as Validation from "./common";

export class FinancialLoanVirementDtoValidator extends Results<FinancialLoanVirementDto> {
  constructor(
    public model: FinancialLoanVirementDto,
    public showValidationErrors: boolean,
    private readonly submit: boolean,
  ) {
    super(model, showValidationErrors);
  }

  private readonly editablePeriods = this.model.loans.filter(x => x.isEditable).map(x => x.period);

  public readonly totals = this.validateTotals();
  public readonly totalValue = this.validateTotalValue();
  public readonly items = this.validateItems();

  private validateTotals() {
    return this.model.loans.reduce(
      (total, virement) => ({
        currentTotal: roundCurrency(total.currentTotal + virement.currentValue),
        updatedTotal: roundCurrency(total.updatedTotal + virement.newValue),
      }),
      {
        currentTotal: 0,
        updatedTotal: 0,
      },
    );
  }

  private validateTotalValue() {
    // Note: Delegate children to validate themselves
    const ignoreSingleVirementChanges = this.editablePeriods.length === 1;

    if (!this.submit || ignoreSingleVirementChanges) return Validation.valid(this);

    const isOverdrawnLoan = this.totals.updatedTotal - this.totals.currentTotal <= 0;

    return Validation.isTrue(this, isOverdrawnLoan, this.getErrorMessage(this.editablePeriods));
  }

  private validateItems() {
    const isOverdrawnLoan = this.totals.updatedTotal - this.totals.currentTotal <= 0;

    return Validation.requiredChild(
      this,
      this.model.loans,
      x =>
        new FinancialLoanVirement(
          x,
          this.model.loans,
          isOverdrawnLoan,
          this.showValidationErrors,
          this.submit,
          period => this.getErrorMessage([period]),
        ),
    );
  }

  private getErrorMessage(periodsWithErrors: number[]): string {
    const uniqueId = periodsWithErrors.join(", ");

    const absoluteTotalOffset = Math.abs(this.totals.updatedTotal - this.totals.currentTotal);
    const totalLoanAmount = getCurrency(this.totals.currentTotal);
    const offsetAmountFromTotal = getCurrency(absoluteTotalOffset);

    return `You cannot exceed '${totalLoanAmount}' by '${offsetAmountFromTotal}'. Adjust period '${uniqueId}' to proceed.`;
  }
}

class FinancialLoanVirement<T extends FinancialLoanVirementDto["loans"][0]> extends Results<T> {
  constructor(
    public model: T,
    public allVirements: T[],
    public hasOverdrawnLoan: boolean,
    public showValidationErrors: boolean,
    public submit: boolean,
    private errorMessage: (errorVirementByPeriod: number) => string,
  ) {
    super(model, showValidationErrors);
  }

  public period = this.validatePeriod();
  public newDate = this.validateNewDate();
  public newValue = this.validateNewValue();

  private validatePeriod(): Result {
    if (!this.submit) return Validation.valid(this);

    return Validation.isPositiveInteger(this, this.model.period, "Virement 'period' is not valid.");
  }

  private validateNewDate(): Result {
    if (!this.submit || !this.model.isEditable) return Validation.valid(this);

    const currentVirementIndex = this.allVirements.findIndex(x => x.id === this.model.id);
    const previousVirement = this.allVirements[currentVirementIndex - 1];
    const currentVirement = this.allVirements[currentVirementIndex];

    // Note: First date can be anything no previous collision possible
    if (currentVirementIndex === 0) return Validation.valid(this);
    const previousDrawdownDateInMs = previousVirement.newDate.getTime();
    const updatedDateInMs = currentVirement.newDate.getTime();

    const hasFutureDate = updatedDateInMs > previousDrawdownDateInMs;

    return Validation.isTrue(
      this,
      hasFutureDate,
      `Period '${currentVirement.period}' must be dated after period '${previousVirement.period}' drawdown.`,
    );
  }

  private validateNewValue(): Result {
    if (!this.submit || !this.model.isEditable) return Validation.valid(this);

    const editablePeriods = this.allVirements.filter(x => x.isEditable).map(x => x.period);
    const hasEditablePeriods: boolean = editablePeriods.length > 1;

    return hasEditablePeriods
      ? Validation.valid(this) // Note: FinancialLoanVirementDtoValidator.totalValue() captures multiple validation
      : Validation.isTrue(this, this.hasOverdrawnLoan, this.errorMessage(this.model.period));
  }
}

export class FinancialVirementDtoValidator extends Results<FinancialVirementDto> {
  constructor(model: FinancialVirementDto, showValidationErrors: boolean, private readonly submit: boolean) {
    super(model, showValidationErrors);
  }

  private filteredPartners = () => {
    const currentPartnerVirementsDto = this.model.partners?.find(p => p.partnerId === this.model.currentPartnerId);
    return currentPartnerVirementsDto ? [currentPartnerVirementsDto] : this.model.partners;
  };

  private readonly virementErrorMessage = this.model.currentPartnerId
    ? "There was a problem validating your current virement."
    : "There was a problem validating all virements on partners.";

  public readonly partners = Validation.optionalChild(
    this,
    this.filteredPartners(),
    x => new PartnerVirementsDtoValidator(x, this.showValidationErrors),
    this.virementErrorMessage,
  );

  // TODO: we are validating this on the partner now, but it still needs to be untangled from the UI at a later date
  public readonly newRemainingGrant = Validation.all(
    this,
    () => Validation.required(this, this.model.newRemainingGrant),
    () =>
      this.submit
        ? Validation.isTrue(
            this,
            this.model.newRemainingGrant <= this.model.originalRemainingGrant,
            "The total grant cannot exceed the remaining grant",
          )
        : Validation.valid(this),
  );
}

export class PartnerVirementsDtoValidator extends Results<PartnerVirementsDto> {
  public readonly virements = Validation.optionalChild(
    this,
    this.model.virements,
    x => new CostCategoryVirementDtoValidator(x, this.showValidationErrors),
  );

  public readonly newRemainingGrant = Validation.all(
    this,
    () => Validation.required(this, this.model.newRemainingGrant, "New remaining grant is required"),
    () => Validation.isTrue(this, this.model.newRemainingGrant >= 0, "Grant cannot be less zero"),
  );
}

export class CostCategoryVirementDtoValidator extends Results<CostCategoryVirementDto> {
  public readonly newPartnerEligibleCosts = Validation.all(
    this,
    () => Validation.required(this, this.model.newEligibleCosts, "Costs are required"),
    () =>
      Validation.isTrue(
        this,
        this.model.newEligibleCosts >= this.model.costsClaimedToDate,
        `Costs cannot be less than amount already claimed for ${this.model.costCategoryName}`,
      ),
    () => Validation.isTrue(this, this.model.newEligibleCosts >= 0, "Costs cannot be less zero"),
  );
}
