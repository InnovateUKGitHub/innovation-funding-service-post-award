import { CostCategoryGroupType, CostCategoryType, PCRSpendProfileOverheadRate } from "@framework/constants";
import {
  PCRSpendProfileAcademicCostDto,
  PCRSpendProfileCapitalUsageCostDto,
  PCRSpendProfileCostDto,
  PcrSpendProfileDto,
  PCRSpendProfileFundingDto,
  PCRSpendProfileLabourCostDto,
  PCRSpendProfileMaterialsCostDto,
  PCRSpendProfileOtherCostsDto,
  PCRSpendProfileOtherFundingDto,
  PCRSpendProfileOverheadsCostDto,
  PCRSpendProfileSubcontractingCostDto,
  PCRSpendProfileTravelAndSubsCostDto,
} from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryList } from "@framework/types";
import { hasNoDuplicates } from "@framework/util/arrayHelpers";
import { Results } from "../validation";
import * as Validation from "./common";

export class PCRSpendProfileDtoValidator extends Results<PcrSpendProfileDto> {
  constructor(model: PcrSpendProfileDto, showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }

  private getCostValidator(cost: PCRSpendProfileCostDto) {
    switch (cost.costCategory) {
      case CostCategoryType.Academic:
        return new PCRAcademicCostDtoValidator(cost, this.showValidationErrors);
      case CostCategoryType.Labour:
        return new PCRLabourCostDtoValidator(cost as PCRSpendProfileLabourCostDto, this.showValidationErrors);
      case CostCategoryType.Overheads:
        return new PCROverheadsCostDtoValidator(cost as PCRSpendProfileOverheadsCostDto, this.showValidationErrors);
      case CostCategoryType.Materials:
        return new PCRMaterialsCostDtoValidator(cost as PCRSpendProfileMaterialsCostDto, this.showValidationErrors);
      case CostCategoryType.Subcontracting:
        return new PCRSubcontractingCostDtoValidator(
          cost as PCRSpendProfileSubcontractingCostDto,
          this.showValidationErrors,
        );
      case CostCategoryType.Capital_Usage:
        return new PCRCapitalUsageCostDtoValidator(
          cost as PCRSpendProfileCapitalUsageCostDto,
          this.showValidationErrors,
        );
      case CostCategoryType.Travel_And_Subsistence:
        return new PCRTravelAndSubsCostDtoValidator(
          cost as PCRSpendProfileTravelAndSubsCostDto,
          this.showValidationErrors,
        );
      default:
        return new PCROtherCostsDtoValidator(cost, this.showValidationErrors);
    }
  }

  private getFundsValidator(fund: PCRSpendProfileFundingDto) {
    const costCategoryType = new CostCategoryList().fromId(fund.costCategory);
    if (costCategoryType.group === CostCategoryGroupType.Other_Funding) {
      return new PCROtherFundingDtoValidator(fund, this.showValidationErrors);
    }
    return new Results(fund, this.showValidationErrors);
  }

  public costs = Validation.child(
    this,
    this.model?.costs ?? {
      costs: [],
      funds: [],
      pcrItemId: undefined,
    },
    cost => this.getCostValidator(cost),
    // There should be at most one overhead cost item (representing the overheads to the total labour costs)
    val => {
      const ofOverheadType = (x: PCRSpendProfileCostDto) =>
        new CostCategoryList().fromId(x.costCategory).group === CostCategoryGroupType.Overheads;
      const ofAcademicType = (x: PCRSpendProfileCostDto) =>
        new CostCategoryList().fromId(x.costCategory).group === CostCategoryGroupType.Academic;
      return val.all(
        () => {
          return val.isTrue(
            items => items.filter(ofOverheadType).length <= 1,
            "Cannot have more than one overhead cost item",
          );
        },
        () => {
          return val.isTrue(
            items => hasNoDuplicates(items.filter(ofAcademicType).map(x => x.costCategoryId)),
            "Cannot have more than academic cost item of a given category",
          );
        },
      );
    },
  );

  public funds = Validation.optionalChild(this, this.model.funds, fund => this.getFundsValidator(fund));
}

export class PCRBaseCostDtoValidator<T extends PCRSpendProfileCostDto | PCRSpendProfileFundingDto> extends Results<T> {
  constructor(model: T, showValidationErrors: boolean) {
    super(model, showValidationErrors);
  }
}

export type PCRSpendProfileCostDtoValidator =
  | PCRAcademicCostDtoValidator
  | PCRLabourCostDtoValidator
  | PCROverheadsCostDtoValidator
  | PCRMaterialsCostDtoValidator
  | PCRSubcontractingCostDtoValidator
  | PCRCapitalUsageCostDtoValidator
  | PCRTravelAndSubsCostDtoValidator
  | PCROtherCostsDtoValidator;

export class PCROtherFundingDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOtherFundingDto> {
  public description = Validation.required(this, this.model.description, "Source of funding is required");
  public dateSecured = Validation.all(
    this,
    () => Validation.required(this, this.model.dateSecured, "Date secured is required"),
    () => Validation.isDate(this, this.model.dateSecured, "Date secured must be a date"),
  );
  public value = Validation.all(
    this,
    () => Validation.required(this, this.model.value, "Funding amount is required"),
    () => Validation.isCurrency(this, this.model.value, "Funding amount must be a number"),
  );
}

export class PCRAcademicCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileAcademicCostDto> {
  public value = Validation.isCurrency(this, this.model.value, "Value must be a number");
}

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public description = Validation.required(this, this.model.description, "Description of role is required");
  public grossCostOfRole = Validation.all(
    this,
    () => Validation.required(this, this.model.grossCostOfRole, "Gross cost of role is required"),
    () => Validation.isCurrency(this, this.model.grossCostOfRole, "Gross cost of role must be a number"),
  );
  public daysSpentOnProject = Validation.all(
    this,
    () => Validation.required(this, this.model.daysSpentOnProject, "Days spent on project is required"),
    () => Validation.number(this, this.model.daysSpentOnProject, "Days spent on project must be a number"),
  );
  public ratePerDay = Validation.all(
    this,
    () => Validation.required(this, this.model.ratePerDay, "Rate per day is required"),
    () => Validation.isCurrency(this, this.model.ratePerDay, "Rate per day must be a number"),
  );
}

export class PCROverheadsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOverheadsCostDto> {
  public overheadRate = Validation.required(this, this.model.overheadRate || null, "Overhead rate is required");
  public value =
    this.model.overheadRate === PCRSpendProfileOverheadRate.Calculated
      ? Validation.required(this, this.model.value, "Total cost is required")
      : Validation.valid(this);
}

export class PCRMaterialsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileMaterialsCostDto> {
  public description = Validation.required(this, this.model.description, "Item description is required");
  public quantity = Validation.all(
    this,
    () => Validation.required(this, this.model.quantity, "Quantity is required"),
    () => Validation.integer(this, this.model.quantity, "Quantity must be a number"),
  );
  public costPerItem = Validation.all(
    this,
    () => Validation.required(this, this.model.costPerItem, "Cost per item is required"),
    () => Validation.isCurrency(this, this.model.costPerItem, "Cost per item must be a number"),
  );
}

export class PCRSubcontractingCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileSubcontractingCostDto> {
  public description = Validation.required(this, this.model.description, "Subcontractor name is required");
  public subcontractorCountry = Validation.required(this, this.model.subcontractorCountry, "Country is required");
  public subcontractorRoleAndDescription = Validation.required(
    this,
    this.model.subcontractorRoleAndDescription,
    "Role is required",
  );
  public value = Validation.all(
    this,
    () => Validation.required(this, this.model.value, "Cost is required"),
    () => Validation.isCurrency(this, this.model.value, "Cost must be a number"),
  );
}

export class PCRCapitalUsageCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileCapitalUsageCostDto> {
  public description = Validation.required(this, this.model.description, "Item description is required");
  public type = Validation.all(this, () => Validation.required(this, this.model.type || null, "Type is required"));
  public depreciationPeriod = Validation.all(
    this,
    () => Validation.required(this, this.model.depreciationPeriod, "Depreciation period is required"),
    () => Validation.integer(this, this.model.depreciationPeriod, "Depreciation period must be a number"),
  );
  public netPresentValue = Validation.all(
    this,
    () => Validation.required(this, this.model.netPresentValue, "Net present value is required"),
    () => Validation.isCurrency(this, this.model.netPresentValue, "Net present value must be a number"),
  );
  public residualValue = Validation.all(
    this,
    () => Validation.required(this, this.model.residualValue, "Residual value is required"),
    () => Validation.isCurrency(this, this.model.residualValue, "Residual value must be a number"),
  );
  public utilisation = Validation.all(
    this,
    () => Validation.required(this, this.model.utilisation, "Utilisation is required"),
    () =>
      Validation.isTrue(
        this,
        this.model.utilisation === undefined || this.model.utilisation === null || this.model.utilisation < 100,
        "Utilisation must be a value under 100",
      ),
    () => Validation.isPercentage(this, this.model.utilisation, "You must enter a number with up to 2 decimal places"),
  );
}

export class PCRTravelAndSubsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileTravelAndSubsCostDto> {
  public description = Validation.required(this, this.model.description, "Description of cost is required");
  public numberOfTimes = Validation.all(
    this,
    () => Validation.required(this, this.model.numberOfTimes, "Number of times is required"),
    () => Validation.integer(this, this.model.numberOfTimes, "Number of times must be a number"),
  );
  public costOfEach = Validation.all(
    this,
    () => Validation.required(this, this.model.costOfEach, "Cost of each is required"),
    () => Validation.isCurrency(this, this.model.costOfEach, "Cost of each must be a number"),
  );
}

export class PCROtherCostsDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOtherCostsDto> {
  public description = Validation.required(this, this.model.description, "Description of cost is required");
  public value = Validation.all(
    this,
    () => Validation.required(this, this.model.value, "Estimated cost is required"),
    () => Validation.isCurrency(this, this.model.value, "Estimated cost must be a number"),
  );
}
