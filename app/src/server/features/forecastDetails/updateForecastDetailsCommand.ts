import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { ISalesforceProfileDetails } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetAllForecastsGOLCostsQuery, GetAllForPartnerQuery, GetCostCategoriesQuery, UpdateClaimCommand } from "@server/features/claims";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails";
import { GetByIdQuery as GetProjectById } from "@server/features/projects";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { Authorisation, ClaimDto, ClaimStatus, IContext, ProjectRole } from "@framework/types";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly submit: boolean
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const project = await context.runQuery(new GetProjectById(this.projectId));
    const existing = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.getPrepareForecastValues(context, project.periodId, existing);
    const claims = await context.runQuery(new GetAllForPartnerQuery(this.partnerId));
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));

    await this.testValidation(claims, claimDetails, golCosts);
    await this.testPastForecastPeriodsHaveNotBeenUpdated(project.periodId, preparedForecasts, existing);
    await this.updateProfileDetails(context, preparedForecasts, existing);

    if (this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async getPrepareForecastValues(context: IContext, currentPeriodId: number, existing: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const allCostCategories = await context.runQuery(new GetCostCategoriesQuery());
    const calculatedCostCategoryIds = allCostCategories.filter(x => x.isCalculated).map(x => x.id);
    const relatedCostCategoryIds = allCostCategories.filter(x => x.hasRelated).map(x => x.id);

    if (this.forecasts.every(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1)) {
      return Promise.resolve(this.forecasts);
    }

    const overheadRate = await context.repositories.partners.getById(this.partnerId).then(x => x.Acc_OverheadRate__c);

    return this.forecasts.map(forecast => {
      return Object.assign({}, forecast, {value : this.getForecastValue(context, forecast, currentPeriodId, overheadRate, calculatedCostCategoryIds, relatedCostCategoryIds, this.forecasts, existing)});
    });
  }

  private getForecastValue(context: IContext, forecast: ForecastDetailsDTO, currentPeriodId: number, overheadRate: number, calculatedCostCategoryIds: string[], relatedCostCategoryIds: string[], sent: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    // if its for past period dont change
    if (forecast.periodId <= currentPeriodId) {
      return forecast.value;
    }

    // if its not calculated dont change
    if (!context.config.features.calculateOverheads || calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1) {
      return forecast.value;
    }

    // calculated - find the related update or if not sent then the existing related value
    const related = [...sent, ...existing].find(x => relatedCostCategoryIds.indexOf(x.costCategoryId) !== -1 && forecast.periodId === x.periodId);

    if (!related) {
      throw new BadRequestError("Unable to calculate overheads");
    }

    return related.value * overheadRate / 100;
  }

  private async testValidation(claims: ClaimDto[], claimDetails: ClaimDetailsSummaryDto[], golCosts: GOLCostDto[]) {
    const showErrors = true;
    const validation = new ForecastDetailsDtosValidator(this.forecasts, claims, claimDetails, golCosts, showErrors);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }
  }

  private async testPastForecastPeriodsHaveNotBeenUpdated(periodId: number, forecasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    const allUpdatesAllowed = forecasts.every(x => {
      if (x.periodId >= periodId) {
        return true;
      }
      return !this.hasChanged(x, existing);
    });

    if (!allUpdatesAllowed) {
      throw new BadRequestError("You can't update the forecast of approved periods.");
    }
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(context: IContext, forecasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    const updates = forecasts.filter(x => this.hasChanged(x, existing)).map<Updatable<ISalesforceProfileDetails>>(x => ({
      Id: x.id,
      Acc_LatestForecastCost__c: x.value
    }));

    return context.repositories.profileDetails.update(updates);
  }

  private async updateClaim(context: IContext) {
    const query = new GetAllForPartnerQuery(this.partnerId);
    const claims = await context.runQuery(query);
    const claim = claims.find(x => !x.isApproved);

    if (!claim) {
      throw new BadRequestError("Unable to find current claim.");
    }

    claim.status = this.nextClaimStatus(claim);
    const updateClaimCommand = new UpdateClaimCommand(this.projectId, claim);
    await context.runCommand(updateClaimCommand);
  }

  private nextClaimStatus(claim: ClaimDto) {
    switch (claim.status) {
      case ClaimStatus.DRAFT: return ClaimStatus.SUBMITTED;
      case ClaimStatus.MO_QUERIED: return ClaimStatus.SUBMITTED;
      case ClaimStatus.INNOVATE_QUERIED: return ClaimStatus.AWAITING_IUK_APPROVAL;
    }

    throw new BadRequestError(`Claim in invalid status. Cannot get next claim status for claim in ${claim.status}`);
  }
}
