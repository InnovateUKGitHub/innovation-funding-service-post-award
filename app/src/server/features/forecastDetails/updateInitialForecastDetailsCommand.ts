/* eslint-disable @typescript-eslint/naming-convention */
import { BadRequestError, CommandBase, InActiveProjectError, ValidationError } from "@server/features/common";
import { ISalesforcePartner, ISalesforceProfileDetails } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { PartnerSpendProfileStatusMapper } from "@server/features/partners/mapToPartnerDto";
import { GetByIdQuery } from "@server/features/partners";
import { GetAllForecastsGOLCostsQuery } from "@server/features/claims";
import {
  Authorisation,
  ForecastDetailsDTO,
  IContext,
  PartnerDto,
  PartnerStatus,
  ProjectRole,
  SpendProfileStatus,
} from "@framework/types";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";
import { GetProjectStatusQuery } from "../projects";

export class UpdateInitialForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly isSubmitting: boolean,
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

    const partner = await context.runQuery(new GetByIdQuery(this.partnerId));

    if (partner.partnerStatus !== PartnerStatus.Pending) {
      throw new BadRequestError("Cannot update partner initial forecast");
    }

    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(partner));
    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));

    const validation = new InitialForecastDetailsDtosValidator(
      this.forecasts,
      golCosts,
      costCategories,
      this.isSubmitting,
      true,
    );

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }

    const existing = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.ignoreCalculatedCostCategories(costCategories, this.forecasts);

    await this.updateProfileDetails(context, preparedForecasts, existing, this.isSubmitting);
    await this.updatePartner(context, partner, this.isSubmitting);

    return true;
  }

  private async ignoreCalculatedCostCategories(costCategories: CostCategoryDto[], dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await costCategories.filter(x => x.isCalculated).map(x => x.id);
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
