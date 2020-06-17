import { Results } from "../validation";
import * as Validation from "./common";
import {
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileOverheadRate } from "@framework/constants";

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
      case CostCategoryType.Overheads: return new PCROverheadsCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Materials: return new PCRMaterialsCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Subcontracting: return new PCRSubcontractingCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Capital_Usage: return new PCRCapitalUsageCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Travel_And_Subsistence: return new PCRTravelAndSubsCostDtoValidator(cost, this.showValidationErrors);
      default: return new PCROtherCostsDtoValidator(cost, this.showValidationErrors);
    }
  }

  public costs = Validation.child(this, this.model.costs,
    cost => this.getCostValidator(cost),
    // Overhead costs is the only cost category that should have only one cost representing the overheads to the total labour costs
    val => val.isTrue(list => list.filter(x => x.costCategory === CostCategoryType.Overheads).length <= 1)
  );
}

export class PCRBaseCostDtoValidator<T extends PCRSpendProfileCostDto> extends Results<T> {
  constructor(
    model: T,
    showValidationErrors: boolean,
  ) {
    super(model, showValidationErrors);
  }
}

export type PCRSpendProfileCostDtoValidator =
    PCRLabourCostDtoValidator
    | PCROverheadsCostDtoValidator
    | PCRMaterialsCostDtoValidator
    | PCRSubcontractingCostDtoValidator
    | PCRCapitalUsageCostDtoValidator
    | PCRTravelAndSubsCostDtoValidator
    | PCROtherCostsDtoValidator;

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public description = Validation.required(this, this.model.description, "Description of role is required");
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

export class PCROverheadsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOverheadsCostDto> {
  public overheadRate = Validation.required(this, this.model.overheadRate || null, "Overhead rate is required");
  public value = this.model.overheadRate === PCRSpendProfileOverheadRate.Calculated
    ? Validation.required(this, this.model.value, "Total cost is required")
    : Validation.valid(this);
}

export class PCRMaterialsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileMaterialsCostDto> {
  public description = Validation.required(this, this.model.description, "Item description is required");
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
  public description = Validation.required(this, this.model.description, "Item description is required");
  public type = Validation.all(this,
    () => Validation.required(this, this.model.type || null, "Type is required"),
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

export class PCRTravelAndSubsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileTravelAndSubsCostDto> {
  public description = Validation.required(this, this.model.description, "Description of cost is required");
  public numberOfTimes = Validation.all(this,
    () => Validation.required(this, this.model.numberOfTimes, "Number of times is required"),
    () => Validation.integer(this, this.model.numberOfTimes, "Number of times must be a number")
  );
  public costOfEach = Validation.all(this,
    () => Validation.required(this, this.model.costOfEach, "Cost of each is required"),
    () => Validation.isCurrency(this, this.model.costOfEach, "Cost of each must be a number")
  );
}

export class PCROtherCostsDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOtherCostsDto> {
  public description = Validation.required(this, this.model.description, "Description of cost is required");
  public value = Validation.all(this,
    () => Validation.required(this, this.model.value, "Estimated cost is required"),
    () => Validation.isCurrency(this, this.model.value, "Estimated cost must be a number")
  );
}
