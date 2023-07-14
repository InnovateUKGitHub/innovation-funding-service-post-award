import { ClaimDetailsSummaryDto, ClaimDto, ForecastDetailsDTO, GOLCostDto, PartnerDto } from "@framework/types";
import { NestedResult } from "@ui/validation";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import * as Validation from "./common";
import { roundCurrency } from "@framework/util";

export interface IForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]> {
  items: NestedResult<IForecastDetailsDtoValidator>;
  costCategoryForecasts: NestedResult<IForecastDetailsDtoCostCategoryValidator>;
  totalCosts: Result;
}
export interface IForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> {
  id: Result;
  value: Result;
}
export interface IForecastDetailsDtoCostCategoryValidator extends Results<CostCategoryForecast> {
  value: Result;
}

export interface CostCategoryForecast {
  golCost: GOLCostDto;
  forecasts: ForecastDetailsDTO[];
  costCategory: CostCategoryDto;
}

export class ForecastDetailsDtosValidator
  extends Results<ForecastDetailsDTO[]>
  implements IForecastDetailsDtosValidator
{
  public readonly items = Validation.optionalChild(this, this.model, x => new ForecastDetailsDtoValidator(x));
  public totalCosts: Result;
  public costCategoryForecasts: NestedResult<IForecastDetailsDtoCostCategoryValidator>;

  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly claims: ClaimDto[],
    private readonly claimDetails: ClaimDetailsSummaryDto[],
    private readonly golCosts: GOLCostDto[],
    private readonly partner: PartnerDto | undefined,
    private readonly showErrors: boolean,
  ) {
    super({ model: forecasts, showValidationErrors: showErrors });

    // infer period id from all the claim details we have
    const periodId = claims.reduce((prev, item) => (item.periodId > prev ? item.periodId : prev), 0);
    const totalGolCosts = golCosts.reduce((total, current) => total + current.value, 0);
    const totalClaimCosts = roundCurrency(
      claimDetails.filter(x => x.periodId <= periodId).reduce((total, current) => total + current.value, 0),
    );
    const totalForecastCosts = roundCurrency(
      forecasts.filter(x => x.periodId > periodId).reduce((total, current) => total + current.value, 0),
    );
    const currentClaim = claims.find(x => x.periodId === periodId) || null;
    const finalClaim = claims.find(x => x.isFinalClaim) || null;

    if (this.items.isValid) {
      this.totalCosts = Validation.all(
        this,
        () =>
          Validation.isFalse(
            this,
            currentClaim && currentClaim.isFinalClaim,
            this.getContent(x => x.validation.forecastDetailsDtoValidator.noEditAboutToSubmitFinalClaim),
          ),
        () =>
          Validation.isFalse(
            this,
            finalClaim && finalClaim.isApproved,
            this.getContent(x => x.validation.forecastDetailsDtoValidator.noEditAlreadySubmittedFinalClaim),
          ),
        () =>
          Validation.isTrue(
            this,
            !partner || !partner.isWithdrawn,
            this.getContent(x => x.validation.forecastDetailsDtoValidator.noEditWithdrawn),
          ),
        () =>
          Validation.isTrue(
            this,
            totalForecastCosts + totalClaimCosts <= totalGolCosts,
            this.getContent(x => x.validation.forecastDetailsDtoValidator.totalTooLarge),
          ),
      );
    } else {
      this.totalCosts = Validation.valid(this);
    }
    this.costCategoryForecasts = Validation.optionalChild(
      this,
      [],
      x => new ValidForecastDetailsDtoCostCategoryValidator(x),
    );
  }
}

export class ForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> implements IForecastDetailsDtoValidator {
  constructor(forecast: ForecastDetailsDTO) {
    super({ model: forecast, showValidationErrors: true });
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

class ValidForecastDetailsDtoCostCategoryValidator
  extends Results<CostCategoryForecast>
  implements IForecastDetailsDtoCostCategoryValidator
{
  constructor(forecasts: CostCategoryForecast) {
    super({ model: forecasts, showValidationErrors: false });
  }
  public value = Validation.valid(this);
}
