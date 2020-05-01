import { Results } from "../validation";
import * as Validation from "./common";
import {
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto, PCRSpendProfileMaterialsCostDto, PCRSpendProfileUnknownCostDto
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
  public value = Validation.all(this,
    () => Validation.required(this, this.model.value, "Value is required"),
    () => Validation.isCurrency(this, this.model.value, "Value must be a number")
  );
}
export type PCRSpendProfileCostDtoValidator = PCRLabourCostDtoValidator | PCRMaterialsCostDtoValidator | PCRUnknownCostDtoValidator;

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public role = Validation.required(this, this.model.role, "Role is required");
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
  public item = Validation.required(this, this.model.item, "Item is required");
  public quantity = Validation.all(this,
    () => Validation.required(this, this.model.quantity, "Quantity is required"),
    () => Validation.integer(this, this.model.quantity, "Quantity must be a number")
  );
  public costPerItem = Validation.all(this,
    () => Validation.required(this, this.model.costPerItem, "Cost per item is required"),
    () => Validation.isCurrency(this, this.model.costPerItem, "Cost per item must be a number")
  );
}

export class PCRUnknownCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileUnknownCostDto> {
}
