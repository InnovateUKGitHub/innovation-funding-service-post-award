import { Results } from "../validation";
import * as Validation from "./common";
import {
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileLabourCostDto
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
    // tslint:disable-next-line:no-small-switch
    switch(cost.costCategory) {
      case CostCategoryType.Labour: return new PCRLabourCostDtoValidator(cost, this.showValidationErrors);
      default: return new PCRBaseCostDtoValidator(cost, this.showValidationErrors);
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
  protected value = Validation.required(this, this.model.value, "Value is required");
}

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public role = Validation.required(this, this.model.role, "Role is required");
  public grossCostOfRole = Validation.required(this, this.model.grossCostOfRole, "Gross cost of role is required");
  public daysSpentOnProject = Validation.required(this, this.model.daysSpentOnProject, "Days spent on project is required");
  public ratePerDay = Validation.required(this, this.model.ratePerDay, "Rate per day is required");
}
