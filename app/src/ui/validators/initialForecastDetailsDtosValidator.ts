import { groupBy, isNumber, sum, roundCurrency } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  CostCategoryForecast,
  IForecastDetailsDtoCostCategoryValidator,
  IForecastDetailsDtosValidator,
  IForecastDetailsDtoValidator,
} from "@ui/validators/forecastDetailsDtosValidator";
import { ForecastDetailsDTO, GOLCostDto } from "@framework/dtos";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import * as Validation from "./common";

export class InitialForecastDetailsDtosValidator
  extends Results<ForecastDetailsDTO[]>
  implements IForecastDetailsDtosValidator {
  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly golCosts: GOLCostDto[],
    private readonly costCategories: CostCategoryDto[],
    private readonly submit: boolean,
    private readonly showErrors: boolean,
  ) {
    super(forecasts, showErrors);
  }

  public readonly items = this.validateItems();
  public readonly costCategoryForecasts = this.validateCategoryForecasts();
  public readonly totalCosts: Result = Validation.valid(this);

  private validateItems() {
    return Validation.optionalChild(
      this,
      this.model,
      x => new InitialForecastDetailsDtoValidator(x, this.showValidationErrors),
    );
  }

  private validateCategoryForecasts() {
    const costCategoryForecasts = this.mapCostCategoryForecasts();

    return Validation.optionalChild(
      this,
      costCategoryForecasts,
      x => new InitialForecastDetailsDtoCostCategoryValidator(x, this.submit, this.showValidationErrors),
    );
  }

  private mapCostCategoryForecasts(): CostCategoryForecast[] {
    const groupedCostCategories = groupBy(this.forecasts, dto => dto.costCategoryId);
    const groupedForecasts = Array.from(groupedCostCategories.entries());

    return this.costCategories.map(costCategory => {
      const entry = groupedForecasts.find(x => x[0] === costCategory.id);
      const golCost = this.golCosts.find(gol => gol.costCategoryId === costCategory.id);
      if(!golCost) throw new Error("Unable to find matching golCostDto");
      return {
        golCost,
        costCategory,
        forecasts: entry?.[1] ?? [],
      };
    });
  }
}

export class InitialForecastDetailsDtoValidator
  extends Results<ForecastDetailsDTO>
  implements IForecastDetailsDtoValidator {
  constructor(forecast: ForecastDetailsDTO, showValidationErrors: boolean) {
    super(forecast, showValidationErrors);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
  public value = Validation.all(
    this,
    () => Validation.required(this, this.model.value, "Forecast is required."),
    () => Validation.number(this, this.model.value, "Forecast must be a number."),
  );
}

export class InitialForecastDetailsDtoCostCategoryValidator
  extends Results<CostCategoryForecast>
  implements IForecastDetailsDtoCostCategoryValidator {
  constructor(
    public readonly forecast: CostCategoryForecast,
    public readonly submit: boolean,
    public readonly showValidationErrors: boolean,
  ) {
    super(forecast, showValidationErrors);
  }
  private validateCostCategory() {
    /**
     * Note:
     *
     * 1) Ignore validation when not submitting
     * 2) Skip validation on calculated forecasts to support non-js form submissions
     */
    const shouldNotValidate = !this.submit || this.model.costCategory.isCalculated;

    if (shouldNotValidate) return Validation.valid(this);

    const accumulatedForecastTotals = sum(this.model.forecasts, x => (isNumber(x.value) ? x.value : 0));
    const totalCategoryForecast = roundCurrency(accumulatedForecastTotals);

    const isValid = totalCategoryForecast === this.model.golCost.value;

    const categoryNameLowerCase = this.model.costCategory.name.toLocaleLowerCase();
    const costCategoryErrorMessage = `The total forecasts for ${categoryNameLowerCase} must be the same as the total eligible costs`;

    return Validation.isTrue(this, isValid, costCategoryErrorMessage);
  }

  public value = this.validateCostCategory();
}
