import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { PartnerSpendProfileStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { PartnerStatus, SpendProfileStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforcePartner } from "@server/repositories/partnersRepository";
import { ISalesforceProfileDetails } from "@server/repositories/profileDetailsRepository";
import { InitialForecastDetailsDtosValidator } from "@ui/validation/validators/initialForecastDetailsDtosValidator";
import { GetAllGOLForecastedCostCategoriesQuery } from "../claims/GetAllGOLForecastedCostCategoriesQuery";
import { InActiveProjectError, BadRequestError, ValidationError } from "../common/appError";
import { AuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../partners/getByIdQuery";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetUnfilteredCostCategoriesQuery } from "../claims/getCostCategoriesQuery";

export class UpdateInitialForecastDetailsCommand extends AuthorisedAsyncCommandBase<boolean> {
  public readonly runnableName: string = "UpdateInitialForecastDetailsCommand";
  constructor(
    private readonly projectId: ProjectId,
    private readonly partnerId: PartnerId,
    private readonly forecasts: Pick<ForecastDetailsDTO, "id" | "value">[],
    private readonly isSubmitting: boolean,
  ) {
    super();
  }

  async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext) {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) {
      throw new InActiveProjectError();
    }

    const partner = await context.runQuery(new GetByIdQuery(this.partnerId));

    if (partner.partnerStatus !== PartnerStatus.Pending) {
      throw new BadRequestError("Cannot update partner initial forecast");
    }

    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(partner));
    const golCosts = await context.runQuery(new GetAllGOLForecastedCostCategoriesQuery(this.partnerId));

    const existing = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.prepareForecasts(context, existing, this.forecasts);

    const validation = new InitialForecastDetailsDtosValidator(
      preparedForecasts,
      golCosts,
      costCategories,
      this.isSubmitting,
      true,
    );

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }
    await this.updateProfileDetails(context, preparedForecasts, existing, this.isSubmitting);
    await this.updatePartner(context, partner, this.isSubmitting);

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

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);

    // TODO: Check this logic
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(
    context: IContext,
    forecasts: ForecastDetailsDTO[],
    existing: ForecastDetailsDTO[],
    isSubmitting: boolean,
  ): Promise<boolean> {
    // TODO: Reduce iteration count in this Loop (consider for-loop/reduce)
    const updates: Updatable<ISalesforceProfileDetails>[] = isSubmitting
      ? forecasts.map<Updatable<ISalesforceProfileDetails>>(x => ({
          Id: x.id,
          Acc_InitialForecastCost__c: x.value,
          Acc_LatestForecastCost__c: x.value,
        }))
      : forecasts
          .filter(x => this.hasChanged(x, existing))
          .map<Updatable<ISalesforceProfileDetails>>(x => ({
            Id: x.id,
            Acc_InitialForecastCost__c: x.value,
          }));

    if (!updates.length) return true;

    return context.repositories.profileDetails.update(updates);
  }

  private async updatePartner(context: IContext, partnerDto: PartnerDto, isSubmitting: boolean): Promise<void> {
    const updatedStatus = SpendProfileStatus[isSubmitting ? "Complete" : "Incomplete"];
    const updatedSpendProfile = new PartnerSpendProfileStatusMapper().mapToSalesforce(updatedStatus);

    const updatedPartner: Updatable<ISalesforcePartner> = {
      Id: partnerDto.id,
      Acc_SpendProfileCompleted__c: updatedSpendProfile,
    };

    // Note: Update the partner spend profile - This state is used as part of a workflow
    await context.repositories.partners.update(updatedPartner);
  }
}
