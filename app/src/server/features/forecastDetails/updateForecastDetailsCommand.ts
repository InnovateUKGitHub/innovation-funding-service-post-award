import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ForecastDetailsDtosValidator } from "@ui/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartner } from "../claimDetails/getAllByPartnerQuery";
import { GetAllForecastsGOLCostsQuery } from "../claims/getAllForecastGOLCostsQuery";
import { GetAllForPartnerQuery } from "../claims/getAllForPartnerQuery";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { UpdateClaimCommand } from "../claims/updateClaim";
import { InActiveProjectError, BadRequestError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../partners/getByIdQuery";
import { UpdatePartnerCommand } from "../partners/updatePartnerCommand";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";

export class UpdateForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly submit: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext) {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

    const existing = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.ignoreCalculatedCostCategories(context, this.forecasts);
    const claims = await context.runQuery(new GetAllForPartnerQuery(this.partnerId));
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartner(this.partnerId));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const partner = await context.runQuery(new GetByIdQuery(this.partnerId));

    await this.testValidation(claims, claimDetails, golCosts, partner);
    await this.updateProfileDetails(context, preparedForecasts, existing);
    await this.updatePartner(context, partner);

    if (this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async ignoreCalculatedCostCategories(context: IContext, dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await context
      .runQuery(new GetUnfilteredCostCategoriesQuery())
      .then(costCategories => costCategories.filter(x => x.isCalculated).map(x => x.id));

    return dtos.filter(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1);
  }

  private async testValidation(
    claims: ClaimDto[],
    claimDetails: ClaimDetailsSummaryDto[],
    golCosts: GOLCostDto[],
    partner: PartnerDto,
  ) {
    const showErrors = true;
    const validation = new ForecastDetailsDtosValidator(
      this.forecasts,
      claims,
      claimDetails,
      golCosts,
      partner,
      showErrors,
    );

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(
    context: IContext,
    forecasts: ForecastDetailsDTO[],
    existing: ForecastDetailsDTO[],
  ) {
    const updates = forecasts
      .filter(x => this.hasChanged(x, existing))
      .map<Updatable<ISalesforceProfileDetails>>(x => ({
        Id: x.id,
        Acc_LatestForecastCost__c: x.value,
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

  private async updatePartner(context: IContext, partner: PartnerDto) {
    if (!partner.newForecastNeeded) {
      return;
    }
    partner.newForecastNeeded = false;
    const updatePartnerCommand = new UpdatePartnerCommand(partner);
    await context.runCommand(updatePartnerCommand);
  }

  private nextClaimStatus(claim: ClaimDto) {
    switch (claim.status) {
      case ClaimStatus.DRAFT:
        return ClaimStatus.SUBMITTED;
      case ClaimStatus.MO_QUERIED:
        return ClaimStatus.SUBMITTED;
      case ClaimStatus.INNOVATE_QUERIED:
        return ClaimStatus.AWAITING_IUK_APPROVAL;
    }

    throw new BadRequestError(`Claim in invalid status. Cannot get next claim status for claim in ${claim.status}`);
  }
}
