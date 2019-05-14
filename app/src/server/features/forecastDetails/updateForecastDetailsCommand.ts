import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { ISalesforceProfileDetails } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetAllForecastsGOLCostsQuery, GetAllForPartnerQuery, GetCostCategoriesQuery, UpdateClaimCommand } from "@server/features/claims";
import { GetAllClaimDetailsByPartner } from "@server/features/claimDetails";
import { GetByIdQuery as GetPartnerById } from "@server/features/partners";
import { GetByIdQuery as GetProjectById } from "@server/features/projects";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { Authorisation, ClaimDto, ClaimStatus, IContext, PartnerDto, ProjectDto, ProjectRole } from "@framework/types";
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

    const costCategories = await context.runQuery(new GetCostCategoriesQuery()).then(x => x.map<[string, boolean]>(y => [y.id, y.isCalculated])).then(x => new Map(x));
    const partner = await context.runQuery(new GetPartnerById(this.partnerId));
    const project = await context.runQuery(new GetProjectById(partner.projectId));
    const existing = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));

    const filteredForcasts = this.forecasts.filter(x => costCategories.get(x.costCategoryId) !== true);
    const filteredExisting = existing.filter(x => costCategories.get(x.costCategoryId) !== true);

    await this.testValidation(context);
    await this.testPastForecastPeriodsHaveNotBeenUpdated(context, project, partner, filteredForcasts, filteredExisting);
    await this.updateProfileDetails(context, filteredForcasts, filteredExisting);

    if (this.submit) {
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

  private async testPastForecastPeriodsHaveNotBeenUpdated(context: IContext, project: ProjectDto, partner: PartnerDto, forcasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    const passed = existing.filter(x => x.periodId <= project.periodId)
      .every(x => {
        const forecast = forcasts.find(y => y.id === x.id);
        return !!forecast && forecast.value === x.value;
      });

    if (!passed) {
      throw new BadRequestError("You can't update the forecast of approved periods.");
    }
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(context: IContext, forcasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    const updates = forcasts.filter(x => this.hasChanged(x, existing)).map<Updatable<ISalesforceProfileDetails>>(x => ({
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
