import * as Validation from "./common";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { ClaimDto, PartnerDto, PartnerStatus } from "@framework/types";

export class ForecastDetailsDtosValidator extends Results<ForecastDetailsDTO[]>  {
  public readonly items = Validation.optionalChild(this, this.model, x => new ForecastDetailsDtoValidator(x));
  public totalCosts: Result;

  constructor(
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly claims: ClaimDto[],
    private readonly claimDetails: ClaimDetailsSummaryDto[],
    private readonly golCosts: GOLCostDto[],
    private readonly partner: PartnerDto | undefined,
    private readonly showErrors: boolean,
  ) {
    super(forecasts, showErrors);

    // infer period id from all the claim details we have
    const periodId = claims.reduce((prev, item) => item.periodId > prev ? item.periodId : prev, 0);
    const totalGolCosts = golCosts.reduce((total, current) => total += current.value, 0);
    const totalClaimCosts = claimDetails.filter(x => x.periodId <= periodId).reduce((total, current) => total += current.value, 0);
    const totalForecastCosts = forecasts.filter(x => x.periodId > periodId).reduce((total, current) => total += current.value, 0);
    const currentClaim = claims.find(x => x.periodId === periodId) || null;
    const finalClaim = claims.find(x => x.isFinalClaim) || null;

    if (this.items.isValid) {
      this.totalCosts = Validation.all(this,
        () => Validation.isFalse(this, currentClaim && currentClaim.isFinalClaim, "You cannot change your forecast as you are due to submit your final claim."),
        () => Validation.isFalse(this, finalClaim && finalClaim.isApproved, "You cannot change your forecast as you have submitted your final claim."),
        () => Validation.isTrue(this, !partner || (partner.partnerStatus !== PartnerStatus.InvoluntaryWithdrawal && partner.partnerStatus !== PartnerStatus.VoluntaryWithdrawal), "You cannot change your forecast after you have withdrawn from the project."),
        () => Validation.isTrue(this, totalForecastCosts + totalClaimCosts <= totalGolCosts, "Your overall total cannot be higher than your total eligible costs.")
      );
    } else {
      this.totalCosts = Validation.valid(this);
    }
  }
}

export class ForecastDetailsDtoValidator extends Results<ForecastDetailsDTO> {
  constructor(forecast: ForecastDetailsDTO) {
    super(forecast, true);
  }

  public id = Validation.required(this, this.model.id, "Id is required");
  public value = Validation.all(this,
    () => Validation.required(this, this.model.value, "Forecast is required."),
    () => Validation.number(this, this.model.value, "Forecast must be a number.")
  );
}
