import {
  FinancialLoanVirementDto,
  FinancialVirementDto,
  PartnerVirementsDto,
  CostCategoryVirementDto,
} from "@framework/dtos/financialVirementDto";
import { roundCurrency } from "@framework/util/numberHelper";
import { getCurrency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";

import * as Validation from "./common";
import { PCRItemType, enableFinancialVirementItems } from "@framework/constants/pcrConstants";

export class FinancialLoanVirementDtoValidator extends Results<FinancialLoanVirementDto> {
  constructor(
    public model: FinancialLoanVirementDto,
    public showValidationErrors: boolean,
    private readonly submit: boolean,
  ) {
    super({ model, showValidationErrors });
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

  /**
   * Get whether a loan is overdrawn or not.
   * A loan is overdrawn when the new total is greater than the current total.
   */
  private isOverdrawnLoan(): boolean {
    return this.totals.updatedTotal > this.totals.currentTotal;
  }

  private validateTotalValue() {
    // Note: Delegate children to validate themselves
    const ignoreSingleVirementChanges = this.editablePeriods.length === 1;

    if (!this.submit || ignoreSingleVirementChanges) return Validation.valid(this);

    // Validate that a loan is NOT overdrawn.
    return Validation.isTrue(this, !this.isOverdrawnLoan(), this.getErrorMessage(this.editablePeriods));
  }

  private validateItems() {
    return Validation.requiredChild(
      this,
      this.model.loans,
      x =>
        new FinancialLoanVirement(
          x,
          this.model.loans,
          !this.isOverdrawnLoan(),
          this.showValidationErrors,
          this.submit,
          period => this.getErrorMessage([period]),
        ),
    );
  }

  private getErrorMessage(periodsWithErrors: number[]): string {
    const absoluteTotalOffset = Math.abs(this.totals.updatedTotal - this.totals.currentTotal);
    const totalLoanAmount = getCurrency(this.totals.currentTotal);
    const offsetAmountFromTotal = getCurrency(absoluteTotalOffset);

    return this.getContent(x =>
      x.validation.financialVirementDtoValidator.loanAmountTooLarge({
        total: totalLoanAmount,
        amount: offsetAmountFromTotal,
        periods: periodsWithErrors,
        length: periodsWithErrors.length,
      }),
    );
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
    super({ model, showValidationErrors });
  }

  public period = this.validatePeriod();
  public newDate = this.validateNewDate();
  public newValue = this.validateNewValue();

  private validatePeriod(): Result {
    if (!this.submit) return Validation.valid(this);

    return Validation.isPositiveInteger(
      this,
      this.model.period,
      this.getContent(x =>
        x.validation.financialVirementDtoValidator.virementPeriodInvalid({ period: this.model.period }),
      ),
    );
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
      this.getContent(x =>
        x.validation.financialVirementDtoValidator.periodHasFutureDate({
          current: currentVirement.period,
          previous: previousVirement.period,
        }),
      ),
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
  private readonly submit: boolean;
  public pcrItemType: Result;

  constructor({
    model,
    showValidationErrors,
    submit,
    pcrItemType,
  }: {
    model: FinancialVirementDto;
    showValidationErrors: boolean;
    readonly submit: boolean;
    readonly pcrItemType?: PCRItemType;
  }) {
    super({ model, showValidationErrors });
    this.submit = submit;
    this.pcrItemType = pcrItemType
      ? Validation.isTrue(
          this,
          enableFinancialVirementItems.includes(pcrItemType),
          this.getContent(x => x.validation.financialVirementDtoValidator.invalidPcrItemType),
          "invalidPcrType",
        )
      : Validation.valid(this);
  }

  private filteredPartners = () => {
    const currentPartnerVirementsDto = this.model.partners?.find(p => p.partnerId === this.model.currentPartnerId);
    return currentPartnerVirementsDto ? [currentPartnerVirementsDto] : this.model.partners;
  };

  public readonly partners = Validation.optionalChild(
    this,
    this.filteredPartners(),
    x => new PartnerVirementsDtoValidator({ model: x, showValidationErrors: this.showValidationErrors }),
    this.model.currentPartnerId
      ? this.getContent(x => x.validation.financialVirementDtoValidator.generic)
      : this.getContent(x => x.validation.financialVirementDtoValidator.genericAll),
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
            this.getContent(x => x.validation.financialVirementDtoValidator.totalTooLarge),
          )
        : Validation.valid(this),
  );
}

export class PartnerVirementsDtoValidator extends Results<PartnerVirementsDto> {
  public readonly virements = Validation.optionalChild(
    this,
    this.model.virements,
    x => new CostCategoryVirementDtoValidator({ model: x, showValidationErrors: this.showValidationErrors }),
  );

  public readonly newRemainingGrant = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.newRemainingGrant,
        this.getContent(x => x.validation.financialVirementDtoValidator.remainingGrantMissing),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.newRemainingGrant >= 0,
        this.getContent(x => x.validation.financialVirementDtoValidator.remainingGrantTooSmall),
      ),
  );
}

export class CostCategoryVirementDtoValidator extends Results<CostCategoryVirementDto> {
  public readonly newPartnerEligibleCosts = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.newEligibleCosts,
        this.getContent(x => x.validation.financialVirementDtoValidator.costRequired),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.newEligibleCosts >= this.model.costsClaimedToDate,
        this.getContent(x =>
          x.forms.pcr.financialVirements.costCategoryLevel.virements.arrayType.newEligibleCosts.errors.costs_too_small({
            name: this.model.costCategoryName,
          }),
        ),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.newEligibleCosts >= 0,
        this.getContent(
          x =>
            x.forms.pcr.financialVirements.costCategoryLevel.virements.arrayType.newEligibleCosts.errors.too_small
              .number,
        ),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.newEligibleCosts < BigInt("10000000000000000"),
        this.getContent(x => x.validation.financialVirementDtoValidator.costTooBig),
      ),
  );
}
