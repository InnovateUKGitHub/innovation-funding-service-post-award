import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { groupBy } from "@framework/util/arrayHelpers";
import { sumBy, roundCurrency, isNumber } from "@framework/util/numberHelper";
import {
  CostCategoryForecast,
  IForecastDetailsDtoCostCategoryValidator,
  IForecastDetailsDtosValidator,
  IForecastDetailsDtoValidator,
} from "@ui/validation/validators/forecastDetailsDtosValidator";
import { Result } from "../result";
import { Results } from "../results";
import * as Validation from "./common";

export class InitialForecastDetailsDtosValidator
  extends Results<ForecastDetailsDTO[]>
  implements IForecastDetailsDtosValidator
{
  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly golCosts: GOLCostDto[],
    private readonly costCategories: CostCategoryDto[],
    private readonly submit: boolean,
    private readonly showErrors: boolean,
  ) {
    super({ model: forecasts, showValidationErrors: showErrors });
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
      if (!golCost) throw new Error("Unable to find matching golCostDto");
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
  implements IForecastDetailsDtoValidator
{
  constructor(forecast: ForecastDetailsDTO, showValidationErrors: boolean) {
    super({ model: forecast, showValidationErrors });
  }

  public id = Validation.required(
    this,
    this.model.id,
    this.getContent(x => x.validation.forecastDetailsDtoValidator.idRequired),
  );
  public value = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.value,
        this.getContent(x => x.validation.forecastDetailsDtoValidator.forecastRequired),
      ),
    () =>
      Validation.number(
        this,
        this.model.value,
        this.getContent(x => x.validation.forecastDetailsDtoValidator.forecastNotNumber),
      ),
  );
}

export class InitialForecastDetailsDtoCostCategoryValidator
  extends Results<CostCategoryForecast>
  implements IForecastDetailsDtoCostCategoryValidator
{
  constructor(
    public readonly forecast: CostCategoryForecast,
    public readonly submit: boolean,
    public readonly showValidationErrors: boolean,
  ) {
    super({ model: forecast, showValidationErrors });
  }
  private validateCostCategory() {
    /**
     * Note:
     *
     * 1) Ignore validation when not submitting
     * 2) Skip validation on calculated forecasts to support non-js form submissions
     * 3) Skip validation if no forecasts for that cost category is avail
     */
    const shouldNotValidate = !this.submit || this.model.costCategory.isCalculated || this.model.forecasts.length === 0;

    if (shouldNotValidate) return Validation.valid(this);

    const accumulatedForecastTotals = sumBy(this.model.forecasts, x => (isNumber(x.value) ? x.value : 0));
    const totalCategoryForecast = roundCurrency(accumulatedForecastTotals);

    const isValid = totalCategoryForecast === this.model.golCost.value;

    return Validation.isTrue(
      this,
      isValid,
      this.getContent(x =>
        x.validation.initialForecastDetailsDtoValidator.costCategoryDoesNotMatchTotalEligibleCosts({
          name: this.model.costCategory.name,
        }),
      ),
    );
  }

  public value = this.validateCostCategory();
}
