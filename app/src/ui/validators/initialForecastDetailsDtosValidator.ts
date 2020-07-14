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
      const [costCategoryId, costCategoryForecasts] = entry;
      return {
        golCost: this.golCosts.find(gol => gol.costCategoryId === costCategoryId)!,
        costCategory,
        forecasts: costCategoryForecasts
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
  constructor(forecasts: CostCategoryForecast, private readonly submit: boolean, showValidationErrors: boolean) {
    super(forecasts, showValidationErrors);
  }

  public value = this.submit
    ? Validation.isTrue(this, sum(this.model.forecasts, x =>isNumber(x.value) ? x.value : 0) === this.model.golCost.value, `The total forecasts for ${this.model.costCategory.name.toLocaleLowerCase()} must be the same as the total eligible costs`)
    : Validation.valid(this);
}
