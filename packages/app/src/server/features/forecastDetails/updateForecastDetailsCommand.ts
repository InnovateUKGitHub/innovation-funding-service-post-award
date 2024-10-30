import { ClaimStatus } from "@framework/constants/claimStatus";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ClaimDetailsSummaryDto } from "@framework/dtos/claimDetailsDto";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { GOLCostDto } from "@framework/dtos/golCostDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { GetAllClaimDetailsByPartnerIdQuery } from "../claimDetails/GetAllClaimDetailsByPartnerIdQuery";
import { GetAllGOLForecastedCostCategoriesQuery } from "../claims/GetAllGOLForecastedCostCategoriesQuery";
import { GetAllClaimsByPartnerIdQuery } from "../claims/GetAllClaimsByPartnerIdQuery";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";
import { UpdateClaimCommand } from "../claims/updateClaim";
import { InActiveProjectError, BadRequestError, ValidationError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../partners/getByIdQuery";
import { UpdatePartnerCommand } from "../partners/updatePartnerCommand";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetAllForecastsForPartnerQuery } from "./getAllForecastsForPartnerQuery";

export class UpdateForecastDetailsCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "UpdateForecastDetailsCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly forecasts: Pick<ForecastDetailsDTO, "id" | "value">[],
    private readonly submit: boolean,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRolePermissionBits.FinancialContact);
  }

  protected async run(context: IContext) {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

    const existing = await context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.prepareForecasts(context, existing, this.forecasts);
    const claims = await context.runQuery(new GetAllClaimsByPartnerIdQuery(this.partnerId));
    const claimDetails = await context.runQuery(new GetAllClaimDetailsByPartnerIdQuery(this.partnerId));
    const golCosts = await context.runQuery(new GetAllGOLForecastedCostCategoriesQuery(this.partnerId));
    const partner = await context.runQuery(new GetByIdQuery(this.partnerId));

    await this.testValidation(preparedForecasts, claims, claimDetails, golCosts, partner);
    await this.updateProfileDetails(context, preparedForecasts, existing);
    await this.updatePartner(context, partner);

    if (this.submit) {
      await this.updateClaim(context);
    }

    return true;
  }

  private async prepareForecasts(
    context: IContext,
    existingDtos: ForecastDetailsDTO[],
    newDtos: Pick<ForecastDetailsDTO, "id" | "value">[],
  ): Promise<ForecastDetailsDTO[]> {
    const returnDtos: ForecastDetailsDTO[] = [];

    for (const newDto of newDtos) {
      const existingDto = existingDtos.find(x => x.id === newDto.id);

      returnDtos.push({
        ...existingDto,
        ...newDto,
      } as ForecastDetailsDTO);
    }

    return await this.ignoreCalculatedCostCategories(context, returnDtos);
  }

  private async ignoreCalculatedCostCategories(context: IContext, dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await context
      .runQuery(new GetUnfilteredCostCategoriesQuery())
      .then(costCategories => costCategories.filter(x => x.isCalculated).map(x => x.id));

    return dtos.filter(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1);
  }

  private async testValidation(
    forecasts: ForecastDetailsDTO[],
    claims: ClaimDto[],
    claimDetails: ClaimDetailsSummaryDto[],
    golCosts: GOLCostDto[],
    partner: PartnerDto,
  ) {
    const showErrors = true;
    const validation = new ForecastDetailsDtosValidator(forecasts, claims, claimDetails, golCosts, partner, showErrors);

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
    const query = new GetAllClaimsByPartnerIdQuery(this.partnerId);
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
