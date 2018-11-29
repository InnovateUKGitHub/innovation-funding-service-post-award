import { CommandBase, IContext } from "../common/context";
import { ValidationError } from "../../../shared/validation";
import { GetAllForecastsGOLCostsQuery, GetClaim, GetCostCategoriesQuery } from "../claims";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claimDetails";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";
import { ClaimStatus } from "../../../types";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private partnerId: string,
    private periodId: number,
    private forecasts: ForecastDetailsDTO[],
    private submit: boolean
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const showErrors = true;
    // TODO - period id needs to be resolved
    const validation = new ForecastDetailsDtosValidator(this.periodId, this.forecasts, claimDetails, golCosts, costCategories, showErrors);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }

    await this.updateProfileDetails(context);

    if(this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async updateProfileDetails(context: IContext) {
    const updates = this.forecasts.map<Updatable<ISalesforceProfileDetails>>(x => ({
      Id: x.id,
      Acc_LatestForecastCost__c: x.value
    }));

    return await context.repositories.profileDetails.update(updates);
  }

  private async updateClaim(context: IContext) {
    const query  = new GetClaim(this.partnerId, this.periodId);
    const claim  = await context.runQuery(query);
    const update = { Id: claim.id, Acc_ClaimStatus__c: ClaimStatus.SUBMITTED };
    return await context.repositories.claims.update(update);
  }
}
