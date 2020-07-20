import * as Validation from "./common";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { groupBy, isNumber, sum } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import {
  CostCategoryForecast,
  IForecastDetailsDtoCostCategoryValidator,
  IForecastDetailsDtosValidator,
  IForecastDetailsDtoValidator
} from "@ui/validators/forecastDetailsDtosValidator";

export class InitialForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]> implements IForecastDetailsDtosValidator {

  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly golCosts: GOLCostDto[],
    private readonly costCategories: CostCategoryDto[],
    private readonly submit: boolean,
    private readonly showErrors: boolean,
  ) {
    super(forecasts, showErrors);
  }

  public readonly items = Validation.optionalChild(this, this.model, x => new InitialForecastDetailsDtoValidator(x, this.showValidationErrors));
  public readonly costCategoryForecasts = Validation.optionalChild(this, this.mapCostCategoryForecasts(), x => new InitialForecastDetailsDtoCostCategoryValidator(x, this.submit, this.showValidationErrors));
  public readonly totalCosts: Result = Validation.valid(this);

  private mapCostCategoryForecasts(): CostCategoryForecast[] {
    const groupedForecasts = Array.from(
      groupBy(this.forecasts, dto => dto.costCategoryId).entries()
    );

    return this.costCategories.map(costCategory => {
      const entry = groupedForecasts.find(x => x[0] === costCategory.id)!;
      return {
        golCost: this.golCosts.find(gol => gol.costCategoryId === costCategory.id)!,
        costCategory,
        forecasts: entry && entry[1]
      };
    });
  }

}

export class InitialForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> implements IForecastDetailsDtoValidator {
  constructor(forecast: ForecastDetailsDTO, showValidationErrors: boolean) {
    super(forecast, showValidationErrors);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
  public value = Validation.all(this,
    () => Validation.required(this, this.model.value, "Forecast is required."),
    () => Validation.number(this, this.model.value, "Forecast must be a number.")
  );
}

class InitialForecastDetailsDtoCostCategoryValidator extends Results<CostCategoryForecast> implements IForecastDetailsDtoCostCategoryValidator {
  constructor(forecast: CostCategoryForecast, private readonly submit: boolean, showValidationErrors: boolean) {
    super(forecast, showValidationErrors);
  }

  private validateCostCategory() {
    if (!this.submit) return Validation.valid(this);

    // Don't validate calculated forecasts to support non-js form submission
    if (this.model.costCategory.isCalculated) return Validation.valid(this);

    const isValid = sum(this.model.forecasts, x => isNumber(x.value) ? x.value : 0) === this.model.golCost.value;
    const message = `The total forecasts for ${this.model.costCategory.name.toLocaleLowerCase()} must be the same as the total eligible costs`;
    return Validation.isTrue(this, isValid, message);
  }

  public value = this.validateCostCategory();
}
