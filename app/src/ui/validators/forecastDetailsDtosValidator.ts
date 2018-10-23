import * as Validation from "./common";
import { Results } from "../validation/results";
import { ClaimDetailsDto, CostCategoryDto, ForecastDetailsDTO, GOLCostDto } from "../models";
import { Result } from "../validation/result";

export class ForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]>  {
  public readonly items = Validation.optionalChild(this, this.model, x => new ForecastDetailsDtoValidator(x));
  public totalCosts: Result;

  constructor(
    private periodId: number,
    private forecasts: ForecastDetailsDTO[],
    private claimDetails: ClaimDetailsDto[],
    private golCosts: GOLCostDto[],
    private costCategories: CostCategoryDto[]
  ) {
    super(forecasts, true);

    const costCategoryIds = costCategories.filter(x => x.organistionType === "Industrial").map(x => x.id);
    const totalGolCosts   = golCosts.reduce(totalReducer, 0);
    const totalClaimCosts = claimDetails.filter(x => costCategoryIds.indexOf(x.costCategoryId) !== -1 && x.periodId < periodId)
      .reduce(totalReducer, 0);
    const totalForecastCosts = forecasts.filter(x => x.periodId >= periodId).reduce(totalReducer, 0);

    this.totalCosts = Validation.isTrue(this, totalForecastCosts + totalClaimCosts <= totalGolCosts, "You can not submit a claim if your forecasts and costs total is higher than your grant offer letter costs. You will be contacted by your Monitoring Officer if this is not amended.");
  }
}

export class ForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> {
  constructor(forecast: ForecastDetailsDTO) {
    super(forecast, true);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
}

const totalReducer = (total: number, item: {value: number}) => total + item.value;
