import { CostCategoryType, CostCategoryGroupType } from "@framework/constants/enums";
import { PCRSpendProfileOverheadRate } from "@framework/constants/pcrConstants";
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
import { CostCategoryList } from "@framework/types/CostCategory";
import { hasNoDuplicates } from "@framework/util/arrayHelpers";
import { Results } from "@ui/validation/results";
import * as Validation from "./common";

export class PCRSpendProfileDtoValidator extends Results<PcrSpendProfileDto> {
  constructor(model: PcrSpendProfileDto, showValidationErrors: boolean) {
    super({ model, showValidationErrors });
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
    return new Results({ model: fund, showValidationErrors: this.showValidationErrors });
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
            this.getContent(x => x.validation.pcrSpendProfileDtoValidator.overheadCostItemTooMany),
          );
        },
        () => {
          return val.isTrue(
            items => hasNoDuplicates(items.filter(ofAcademicType).map(x => x.costCategoryId)),
            this.getContent(x => x.validation.pcrSpendProfileDtoValidator.academicCostItemTooMany),
          );
        },
      );
    },
  );

  public funds = Validation.optionalChild(this, this.model.funds, fund => this.getFundsValidator(fund));
}

export class PCRBaseCostDtoValidator<T extends PCRSpendProfileCostDto | PCRSpendProfileFundingDto> extends Results<T> {
  constructor(model: T, showValidationErrors: boolean) {
    super({ model, showValidationErrors });
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
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrOtherFundingDtoValidator.descriptionRequired),
  );
  public dateSecured = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.dateSecured,
        this.getContent(x => x.validation.pcrOtherFundingDtoValidator.dateSecuredRequired),
      ),
    () =>
      Validation.isDate(
        this,
        this.model.dateSecured,
        this.getContent(x => x.validation.pcrOtherFundingDtoValidator.dateSecuredNotDate),
      ),
  );
  public value = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherFundingDtoValidator.valueRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherFundingDtoValidator.valueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherFundingDtoValidator.valueNotCurrency),
      ),
  );
}

export class PCRAcademicCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileAcademicCostDto> {
  public value = Validation.all(
    this,
    () =>
      Validation.number(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrAcademicCostDtoValidator.valueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrAcademicCostDtoValidator.valueNotCurrency),
      ),
  );
}

export class PCRLabourCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileLabourCostDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrLabourCostDtoValidator.descriptionRequired),
  );
  public grossCostOfRole = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.grossCostOfRole,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.grossCostRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.grossCostOfRole,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.grossCostNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.grossCostOfRole,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.grossCostNotCurrency),
      ),
  );
  public daysSpentOnProject = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.daysSpentOnProject,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.daysSpentOnProjectRequired),
      ),
    () =>
      Validation.isPositiveInteger(
        this,
        this.model.daysSpentOnProject,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.daysSpentOnProjectNotNumber),
      ),
  );
  public ratePerDay = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.ratePerDay,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.ratePerDayRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.ratePerDay,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.ratePerDayNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.ratePerDay,
        this.getContent(x => x.validation.pcrLabourCostDtoValidator.ratePerDayNotCurrency),
      ),
  );
}

export class PCROverheadsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOverheadsCostDto> {
  public overheadRate = Validation.required(
    this,
    this.model.overheadRate || null,
    this.getContent(x => x.validation.pcrOverheadsCostDtoValidator.overheadRateRequired),
  );
  public value =
    this.model.overheadRate === PCRSpendProfileOverheadRate.Calculated
      ? Validation.required(
          this,
          this.model.value,
          this.getContent(x => x.validation.pcrOverheadsCostDtoValidator.valueRequired),
        )
      : Validation.valid(this);
}

export class PCRMaterialsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileMaterialsCostDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.descriptionRequired),
  );
  public quantity = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.quantity,
        this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.quantityRequired),
      ),
    () =>
      Validation.integer(
        this,
        this.model.quantity,
        this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.quantityNotInteger),
      ),
  );
  public costPerItem = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.costPerItem,
        this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.costPerItemRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.costPerItem,
        this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.costPerItemNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.costPerItem,
        this.getContent(x => x.validation.pcrMaterialsCostDtoValidator.costPerItemNotCurrency),
      ),
  );
}

export class PCRSubcontractingCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileSubcontractingCostDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.descriptionRequired),
  );
  public subcontractorCountry = Validation.required(
    this,
    this.model.subcontractorCountry,
    this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.countryRequired),
  );
  public subcontractorRoleAndDescription = Validation.required(
    this,
    this.model.subcontractorRoleAndDescription,
    this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.roleRequired),
  );
  public value = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.valueRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.valueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrSubcontractingCostDtoValidator.valueNotCurrency),
      ),
  );
}

export class PCRCapitalUsageCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileCapitalUsageCostDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.descriptionRequired),
  );
  public type = Validation.all(this, () =>
    Validation.required(
      this,
      this.model.type || null,
      this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.typeRequired),
    ),
  );
  public depreciationPeriod = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.depreciationPeriod,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.deprecationPeriodRequired),
      ),
    () =>
      Validation.integer(
        this,
        this.model.depreciationPeriod,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.deprecationPeriodNotInteger),
      ),
  );
  public netPresentValue = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.netPresentValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.netPresentValueRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.netPresentValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.netPresentValueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.netPresentValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.netPresentValueNotCurrency),
      ),
  );
  public residualValue = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.residualValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.residualValueRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.residualValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.residualValueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.residualValue,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.residualValueNotCurrency),
      ),
  );
  public utilisation = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.utilisation,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.utilisationRequired),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.utilisation === undefined || this.model.utilisation === null || this.model.utilisation < 100,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.utilisationTooLarge),
      ),
    () =>
      Validation.isPercentage(
        this,
        this.model.utilisation,
        this.getContent(x => x.validation.pcrCapitalUsageCostDtoValidator.utilisationNotPercentage),
      ),
  );
}

export class PCRTravelAndSubsCostDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileTravelAndSubsCostDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.descriptionRequired),
  );
  public numberOfTimes = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.numberOfTimes,
        this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.numberOfTimesRequired),
      ),
    () =>
      Validation.integer(
        this,
        this.model.numberOfTimes,
        this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.numberOfTimesNotInteger),
      ),
  );
  public costOfEach = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.costOfEach,
        this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.costOfEachRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.costOfEach,
        this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.costOfEachNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.costOfEach,
        this.getContent(x => x.validation.pcrTravelAndSubsistanceCostDtoValidator.costOfEachNotCurrency),
      ),
  );
}

export class PCROtherCostsDtoValidator extends PCRBaseCostDtoValidator<PCRSpendProfileOtherCostsDto> {
  public description = Validation.required(
    this,
    this.model.description,
    this.getContent(x => x.validation.pcrOtherCostsDtoValidator.descriptionRequired),
  );
  public value = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherCostsDtoValidator.valueRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherCostsDtoValidator.valueNotNumber),
      ),
    () =>
      Validation.isCurrency(
        this,
        this.model.value,
        this.getContent(x => x.validation.pcrOtherCostsDtoValidator.valueNotCurrency),
      ),
  );
}
