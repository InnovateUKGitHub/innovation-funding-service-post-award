import { CommandBase, IContext } from "../common/context";
import { ValidationError } from "../../../shared/validation";
import { GetAllForecastsGOLCostsQuery, GetAllForPartnerQuery, GetCostCategoriesQuery } from "../claims";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claimDetails";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";
import { ClaimDto, ClaimStatus } from "../../../types";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";
import { GetByIdQuery as GetPartnerById } from "../partners";
import { GetByIdQuery as GetProjectById } from "../projects";
import { BadRequestError, StatusCode } from "../../apis/ApiError";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private partnerId: string,
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
    const validation = new ForecastDetailsDtosValidator(this.forecasts, claimDetails, golCosts, costCategories, showErrors);

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
      throw new BadRequestError("You can't update the forecast of approved periods.");
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
    const query  = new GetAllForPartnerQuery(this.partnerId);
    const claims = await context.runQuery(query);
    const claim  = claims.find(x => !x.isApproved);

    if(!claim) {
      throw new BadRequestError("Unable to find current claim.");
    }

    const status = this.nextClaimStatus(claim);
    const update = { Id: claim.id, Acc_ClaimStatus__c: status };
    return await context.repositories.claims.update(update);
  }

  private nextClaimStatus(claim: ClaimDto) {
    switch(claim.status) {
      case ClaimStatus.DRAFT:            return ClaimStatus.SUBMITTED;
      case ClaimStatus.MO_QUERIED:       return ClaimStatus.SUBMITTED;
      case ClaimStatus.INNOVATE_QUERIED: return ClaimStatus.AWAITING_IUK_APPROVAL;
    }

    throw new BadRequestError("Claim in invalid status.");
  }
}
