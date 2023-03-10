import { getArrayFromPeriod } from "@framework/util";
import { ForecastDetailsDTO, IContext, ILinkInfo, ProjectRole } from "@framework/types";

import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "@server/features/forecastDetails";
import { GetAllProjectRolesForUser, GetByIdQuery } from "@server/features/projects";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners";
import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/forms/formHandlerBase";

import {
  AllClaimsDashboardRoute,
  ClaimForecastParams,
  ClaimForecastRoute,
  ClaimsDashboardRoute,
  ClaimSummaryRoute,
} from "@ui/containers";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ClaimForecastFormHandler extends StandardFormHandlerBase<ClaimForecastParams, "forecastDetails"> {
  constructor() {
    super(ClaimForecastRoute, ["default", "save"], "forecastDetails");
  }

  protected async getDto(
    context: IContext,
    params: ClaimForecastParams,
    _button: IFormButton,
    body: IFormBody,
  ): Promise<ForecastDetailsDTO[]> {
    const dto = await context.runQuery(new GetAllForecastsForPartnerQuery(params.partnerId));
    const project = await context.runQuery(new GetByIdQuery(params.projectId));
    const partner = await context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(partner));

    const costCategoriesIdsToUpdate = costCategories.filter(x => !x.isCalculated).map(x => x.id);
    const unClaimedForecasts = getArrayFromPeriod(dto, project.periodId, project.numberOfPeriods);

    return this.getChangesToForecasts(unClaimedForecasts, costCategoriesIdsToUpdate, body);
  }

  protected async run(
    context: IContext,
    params: ClaimForecastParams,
    button: IFormButton,
    dto: ForecastDetailsDTO[],
  ): Promise<ILinkInfo> {
    await context.runCommand(new UpdateForecastDetailsCommand(params.projectId, params.partnerId, dto, false));

    if (button.name === "default") {
      return ClaimSummaryRoute.getLink(params);
    }

    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(params.projectId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params);
    }

    return ClaimsDashboardRoute.getLink(params);
  }

  protected getStoreKey(params: ClaimForecastParams) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: ClaimForecastParams, dto: ForecastDetailsDTO[]) {
    return new ForecastDetailsDtosValidator(dto, [], [], [], undefined, false);
  }

  private getChangesToForecasts(
    unClaimedForecasts: ForecastDetailsDTO[],
    costCategoriesIdsToUpdate: string[],
    body: IFormBody,
  ): ForecastDetailsDTO[] {
    return unClaimedForecasts.reduce<ForecastDetailsDTO[]>((allForecasts, forecast) => {
      const shouldNotUpdateForecast = !costCategoriesIdsToUpdate.includes(forecast.costCategoryId);
      const formValue = body[`value_${forecast.periodId}_${forecast.costCategoryId}`];

      if (shouldNotUpdateForecast || !formValue) return allForecasts;

      // Note: We know input value is available and needs to update SF
      forecast.value = Number(formValue);

      return [...allForecasts, forecast];
    }, []);
  }
}
