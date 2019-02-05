import { DateTime } from "luxon";
import { BadRequestError, CommandBase, ValidationError } from "../common";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";
import { ISalesforceProfileDetails } from "../../repositories";
import { Updatable } from "../../repositories/salesforceBase";
import { GetAllForecastsGOLCostsQuery, GetAllForPartnerQuery } from "../claims";
import { GetAllClaimDetailsByPartner } from "../claimDetails";
import { GetByIdQuery as GetPartnerById } from "../partners";
import { GetByIdQuery as GetProjectById } from "../projects";
import { ForecastDetailsDtosValidator } from "../../../ui/validators/forecastDetailsDtosValidator";
import { ClaimDto, ClaimStatus, IContext, PartnerDto } from "../../../types";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly partnerId: string,
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly submit: boolean
  ) {
    super();
  }

  protected async Run(context: IContext) {
    const partner = await context.runQuery(new GetPartnerById(this.partnerId));

    await this.testValidation(context);
    await this.testPastForecastPeriodsHaveNotBeenUpdated(context, partner);
    await this.updateProfileDetails(context);
    await this.updatePartner(context, partner);

    if(this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async testValidation(context: IContext) {
    const claims = await context.runQuery(new GetAllForPartnerQuery(this.partnerId));
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const showErrors = true;
    const validation = new ForecastDetailsDtosValidator(this.forecasts, claims, claimDetails, golCosts, showErrors);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }
  }

  private async testPastForecastPeriodsHaveNotBeenUpdated(context: IContext, partner: PartnerDto) {
    const project = await context.runQuery(new GetProjectById(partner.projectId));
    const current = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));
    const passed  = current.filter(x => x.periodId <= project.periodId)
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

    return context.repositories.profileDetails.update(updates);
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
    return context.repositories.claims.update(update);
  }

  private async updatePartner(context: IContext, partner: PartnerDto) {
    const now = context.clock.today();
    const dateString = DateTime.fromJSDate(now).toISO();
    const update = { Id: partner.id, Acc_ForecastLastModifiedDate__c: dateString };
    return context.repositories.partners.update(update);
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
