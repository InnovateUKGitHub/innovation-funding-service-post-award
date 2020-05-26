import { Results } from "../validation";
import * as Validation from "./common";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileUnknownCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";

export class PCRSpendProfileDtoValidator extends Results<PcrSpendProfileDto> {

  constructor(
    model: PcrSpendProfileDto,
    showValidationErrors: boolean,
  ) {
    super(model, showValidationErrors);
  }

  private getCostValidator(cost: PCRSpendProfileCostDto) {
    switch(cost.costCategory) {
      case CostCategoryType.Labour: return new PCRLabourCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Materials: return new PCRMaterialsCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Subcontracting: return new PCRSubcontractingCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Capital_Usage: return new PCRCapitalUsageCostDtoValidator(cost, this.showValidationErrors);
      default: return new PCRUnknownCostDtoValidator(cost, this.showValidationErrors);
    }
  }

  public costs = Validation.optionalChild(this, this.model.costs, cost => this.getCostValidator(cost));
}

export class PCRBaseCostDtoValidator<T extends PCRSpendProfileCostDto> extends Results<T> {
  constructor(
    model: T,
    showValidationErrors: boolean,
  ) {
    super(model, showValidationErrors);
  }
  public description = Validation.required(this, this.model.description, "Description is required");
}

export type PCRSpendProfileCostDtoValidator =
    PCRLabourCostDtoValidator
    | PCRMaterialsCostDtoValidator
    | PCRSubcontractingCostDtoValidator
    | PCRCapitalUsageCostDtoValidator
    | PCRUnknownCostDtoValidator;

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public grossCostOfRole = Validation.all(this,
    () => Validation.required(this, this.model.grossCostOfRole, "Gross cost of role is required"),
    () => Validation.isCurrency(this, this.model.grossCostOfRole, "Gross cost of role must be a number")
  );
  public daysSpentOnProject = Validation.all(this,
    () => Validation.required(this, this.model.daysSpentOnProject, "Days spent on project is required"),
    () => Validation.number(this, this.model.daysSpentOnProject, "Days spent on project must be a number")
  );
  public ratePerDay = Validation.all(this,
    () => Validation.required(this, this.model.ratePerDay, "Rate per day is required"),
    () => Validation.isCurrency(this, this.model.ratePerDay, "Rate per day must be a number")
  );
}

export class PCRMaterialsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileMaterialsCostDto> {
  public quantity = Validation.all(this,
    () => Validation.required(this, this.model.quantity, "Quantity is required"),
    () => Validation.integer(this, this.model.quantity, "Quantity must be a number")
  );
  public costPerItem = Validation.all(this,
    () => Validation.required(this, this.model.costPerItem, "Cost per item is required"),
    () => Validation.isCurrency(this, this.model.costPerItem, "Cost per item must be a number")
  );
}

export class PCRSubcontractingCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileSubcontractingCostDto> {
  public description = Validation.required(this, this.model.description, "Subcontractor name is required");
  public subcontractorCountry = Validation.required(this, this.model.subcontractorCountry, "Country is required");
  public subcontractorRoleAndDescription = Validation.required(this, this.model.subcontractorRoleAndDescription, "Role is required");
  public value = Validation.all(this,
      () => Validation.required(this, this.model.value, "Cost is required"),
      () => Validation.isCurrency(this, this.model.value, "Cost must be a number")
  );
}

export class PCRCapitalUsageCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileCapitalUsageCostDto> {
  public type = Validation.all(this,
    () => Validation.required(this, this.model.type, "Type is required"),
  );
  public depreciationPeriod = Validation.all(this,
    () => Validation.required(this, this.model.depreciationPeriod, "Depreciation period is required"),
    () => Validation.integer(this, this.model.depreciationPeriod, "Depreciation period must be a number")
  );
  public netPresentValue = Validation.all(this,
    () => Validation.required(this, this.model.netPresentValue, "Net present value is required"),
    () => Validation.isCurrency(this, this.model.netPresentValue, "Net present value must be a number")
  );
  public residualValue = Validation.all(this,
    () => Validation.required(this, this.model.residualValue, "Residual value is required"),
    () => Validation.isCurrency(this, this.model.residualValue, "Residual value must be a number")
  );
  public utilisation = Validation.all(this,
    () => Validation.required(this, this.model.utilisation, "Utilisation is required"),
    () => Validation.isTrue(this, this.model.utilisation === undefined || this.model.utilisation === null || this.model.utilisation < 100, "Utilisation must be a value under 100"),
    () => Validation.isPercentage(this, this.model.utilisation, "You must enter a number with up to 2 decimal places")
  );
}

export class PCRUnknownCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileUnknownCostDto> {
}
