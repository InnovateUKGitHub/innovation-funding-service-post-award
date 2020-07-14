import * as Validation from "./common";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { NestedResult } from "@ui/validation";
import { groupBy, sum } from "@framework/util";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";

export interface IInitialForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]> {
  items: NestedResult<IInitialForecastDetailsDtoValidator>;
  costCategoryForecasts: NestedResult<InitialForecastDetailsDtoCostCategoryValidator>;
  totalCosts: Result;
}
export interface IInitialForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> {
  id: Result;
  value: Result;
}

export class InitialForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]> implements IInitialForecastDetailsDtosValidator {
  public readonly items = Validation.optionalChild(this, this.model, x => new InitialForecastDetailsDtoValidator(x));
  public totalCosts: Result;
  public costCategoryForecasts: NestedResult<InitialForecastDetailsDtoCostCategoryValidator>;

  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly golCosts: GOLCostDto[],
    private readonly costCategories: CostCategoryDto[],
    private readonly submit: boolean,
    private readonly showErrors: boolean,
  ) {
    super(forecasts, showErrors);

    const totalGolCosts = golCosts.reduce((total, current) => total + current.value, 0);
    const totalForecastCosts = forecasts.reduce((total, current) => total + current.value, 0);

    if (this.items.isValid && this.submit) {
      this.totalCosts = Validation.isTrue(this, totalForecastCosts <= totalGolCosts, "Your overall total cannot be higher than your total eligible costs.");
      this.costCategoryForecasts = Validation.optionalChild(this, this.mapCostCategoryForecasts(), x => new InitialForecastDetailsDtoCostCategoryValidator(x));
    } else {
      this.totalCosts = Validation.valid(this);
      this.costCategoryForecasts = Validation.optionalChild(this, this.mapCostCategoryForecasts(), x => new ValidInitialForecastDetailsDtoCostCategoryValidator(x));
    }
  }

  private mapCostCategoryForecasts(): CostCategoryForecast[] {
    const groupedForecasts = Array.from(
      groupBy(this.forecasts, dto => dto.costCategoryId).entries()
    );
    return groupedForecasts.map(x => {
      const [costCategoryId, costCategoryForecasts] = x;
      return {
        golCost: this.golCosts.find(gol => gol.costCategoryId === costCategoryId)!,
        costCategory: this.costCategories.find(costCat => costCat.id === costCategoryId)!,
        forecasts: costCategoryForecasts
      };
    });
  }

}

export class InitialForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> implements IInitialForecastDetailsDtoValidator {
  constructor(forecast: ForecastDetailsDTO) {
    super(forecast, true);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
  public value = Validation.all(this,
    () => Validation.required(this, this.model.value, "Forecast is required."),
    () => Validation.number(this, this.model.value, "Forecast must be a number.")
  );
}

interface CostCategoryForecast {
  golCost: GOLCostDto;
  forecasts: ForecastDetailsDTO[];
  costCategory: CostCategoryDto;
}

class InitialForecastDetailsDtoCostCategoryValidator extends Results<CostCategoryForecast> {
  constructor(forecasts: CostCategoryForecast) {
    super(forecasts, true);
  }

  public value = Validation.isTrue(this, sum(this.model.forecasts, x => x.value) === this.model.golCost.value, `The total forecasts for ${this.model.costCategory.name.toLocaleLowerCase()} must be the same as the total eligible costs`);
}

class ValidInitialForecastDetailsDtoCostCategoryValidator extends Results<CostCategoryForecast> {
  constructor(forecasts: CostCategoryForecast) {
    super(forecasts, true);
  }

  public value = Validation.valid(this);
}
