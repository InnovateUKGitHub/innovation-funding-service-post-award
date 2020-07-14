import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { ISalesforceProfileDetails } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetAllForecastsGOLCostsQuery, GetCostCategoriesQuery } from "@server/features/claims";
import { Authorisation, IContext, PartnerDto, PartnerStatus, ProjectRole, SpendProfileStatus } from "@framework/types";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { GetByIdQuery } from "@server/features/partners";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";

export class UpdateInitialForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly forecasts: ForecastDetailsDTO[],
    private readonly submit: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const partner = await context.runQuery(new GetByIdQuery(this.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesQuery());

    if (partner.partnerStatus !== PartnerStatus.Pending) {
      throw new BadRequestError("Cannot update partner initial forecast");
    }

    const golCosts = await context.runQuery(new GetAllForecastsGOLCostsQuery(this.partnerId));
    const validation = new InitialForecastDetailsDtosValidator(this.forecasts, golCosts, costCategories, this.submit, true);

    if (!validation.isValid) {
      throw new ValidationError(validation);
    }

    const existing = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.ignoreCalculatedCostCategories(context, this.forecasts);

    await this.updateProfileDetails(context, preparedForecasts, existing, this.submit);
    await this.updatePartner(context, partner, this.submit);

    return true;
  }

  private async ignoreCalculatedCostCategories(context: IContext, dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await context.runQuery(new GetCostCategoriesQuery())
      .then(costCategories => costCategories.filter(x => x.isCalculated).map(x => x.id));

    return dtos.filter(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1);
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);
    return !existingItem || item.value !== existingItem.value;
  }

  private async updatePartner(context: IContext, partnerDto: PartnerDto, submit: boolean) {
    if (submit) {
      partnerDto.spendProfileStatus = SpendProfileStatus.Complete;
    } else {
      partnerDto.spendProfileStatus = SpendProfileStatus.Incomplete;
    }
    await context.runCommand(new UpdatePartnerCommand(partnerDto));
  }

  private async updateProfileDetails(context: IContext, forecasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[], submit: boolean) {
    const updates = submit
      ? forecasts.map<Updatable<ISalesforceProfileDetails>>(x => ({
        Id: x.id,
        Acc_InitialForecastCost__c: x.value,
        Acc_LatestForecastCost__c: x.value,
      }))
      : forecasts.filter(x => this.hasChanged(x, existing)).map<Updatable<ISalesforceProfileDetails>>(x => ({
        Id: x.id,
        Acc_InitialForecastCost__c: x.value
      }));

    return context.repositories.profileDetails.update(updates);
  }

}
