import { CommandBase } from "@server/features/common";
import { ISalesforceProfileDetails } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { GetCostCategoriesQuery } from "@server/features/claims";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";

export class UpdateInitialForecastDetailsCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly partnerId: string,
    private readonly forecasts: ForecastDetailsDTO[],
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forPartner(this.projectId, this.partnerId).hasRole(ProjectRole.FinancialContact);
  }

  protected async Run(context: IContext) {
    const existing = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(this.partnerId));

    const preparedForecasts = await this.ignoreCalculatedCostCategories(context, this.forecasts);

    await this.updateProfileDetails(context, preparedForecasts, existing);

    return true;
  }

  private async ignoreCalculatedCostCategories(context: IContext, dtos: ForecastDetailsDTO[]) {
    // check to see if there are any calculated cost categories
    const calculatedCostCategoryIds = await context.runQuery(new GetCostCategoriesQuery())
      .then(costCategories =>  costCategories.filter(x => x.isCalculated).map(x => x.id));

    return dtos.filter(forecast => calculatedCostCategoryIds.indexOf(forecast.costCategoryId) === -1);
  }

  private hasChanged(item: ForecastDetailsDTO, existing: ForecastDetailsDTO[]): boolean {
    const existingItem = existing.find(x => x.id === item.id);
    return !existingItem || item.value !== existingItem.value;
  }

  private async updateProfileDetails(context: IContext, forecasts: ForecastDetailsDTO[], existing: ForecastDetailsDTO[]) {
    const updates = forecasts.filter(x => this.hasChanged(x, existing)).map<Updatable<ISalesforceProfileDetails>>(x => ({
      Id: x.id,
      Acc_InitialForecastCost__c: x.value
    }));

    return context.repositories.profileDetails.update(updates);
  }

}
