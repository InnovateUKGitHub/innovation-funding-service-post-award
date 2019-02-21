import * as Validation from "./common";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { ClaimDto } from "../../types";

export class ForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]>  {
  public readonly items = Validation.optionalChild(this, this.model, x => new ForecastDetailsDtoValidator(x));
  public totalCosts: Result;

  constructor(
    forecasts: ForecastDetailsDTO[],
    claims: ClaimDto[],
    claimDetails: ClaimDetailsDto[],
    golCosts: GOLCostDto[],
    showErrors: boolean
  ) {
    super(forecasts, showErrors);

    // infer period id from all the claim details we have
    const periodId           = claims.reduce((prev, item) => item.periodId > prev ? item.periodId : prev, 0);
    const totalGolCosts      = golCosts.reduce((total, current) => total += current.value, 0);
    const totalClaimCosts    = claimDetails.filter(x => x.periodId <= periodId).reduce((total, current) => total += current.value, 0);
    const totalForecastCosts = forecasts.filter(x => x.periodId > periodId).reduce((total, current) => total += current.value, 0);

    this.totalCosts = Validation.isTrue(this, totalForecastCosts + totalClaimCosts <= totalGolCosts, "Your overall total cannot be higher than your total eligible costs.");
  }
}

export class ForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> {
  constructor(forecast: ForecastDetailsDTO) {
    super(forecast, true);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
}

const totalReducer = (total: number, item: {value: number}) => total + item.value;
