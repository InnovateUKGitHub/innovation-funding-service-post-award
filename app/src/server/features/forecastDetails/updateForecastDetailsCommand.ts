import { CommandBase, IContext } from "../common/context";
import { ValidationError } from "../../../shared/validation";
import { GetAllForecastsGOLCostsQuery, GetClaim, GetCostCategoriesQuery } from "../claims";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claimDetails";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";
import { ClaimStatus } from "../../../types";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";
import { GetByIdQuery as GetPartnerById } from "../partners";
import { GetByIdQuery as GetProjectById } from "../projects";

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
    await this.testValidation(context);
    await this.testPastForecastPeriodsHaveNotBeenUpdated(context);
    await this.updateProfileDetails(context);

    if(this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async testValidation(context: IContext) {
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());
    const showErrors = true;
    // TODO - period id needs to be resolved
    const validation = new ForecastDetailsDtosValidator(this.periodId, this.forecasts, claimDetails, golCosts, costCategories, showErrors);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }
  }

  private async testPastForecastPeriodsHaveNotBeenUpdated(context: IContext) {
    const partner = await context.runQuery(new GetPartnerById(this.partnerId));
    const project = await context.runQuery(new GetProjectById(partner!.projectId));
    const current = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));
    const passed  = current.filter(x => x.periodId <= project!.periodId)
      .every(x => {
        const forecast = this.forecasts.find(y => y.id === x.id);
        return !!forecast && forecast.value === x.value;
      });

    if(!passed) {
      throw new Error("You can't update the forecast of completed periods.");
    }
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
