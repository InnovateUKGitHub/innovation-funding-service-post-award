import { GetCostCategoriesForPartnerQuery } from "@server/features/claims/getCostCategoriesForPartnerQuery";
import { IFormBody, IFormButton, StandardFormHandlerBase } from "@server/htmlFormHandler/formHandlerBase";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ProjectRole } from "@framework/constants/project";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { IContext } from "@framework/types/IContext";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { getArrayFromPeriod } from "@framework/util/arrayHelpers";
import { ForecastDetailsDtosValidator } from "@ui/validation/validators/forecastDetailsDtosValidator";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { UpdateForecastDetailsCommand } from "@server/features/forecastDetails/updateForecastDetailsCommand";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetAllProjectRolesForUser } from "@server/features/projects/getAllProjectRolesForUser";
import { AllClaimsDashboardRoute } from "@ui/containers/pages/claims/allClaimsDashboard/allClaimsDashboard.page";
import { ClaimForecastParams, ClaimForecastRoute } from "@ui/containers/pages/claims/claimForecast.page";
import { ClaimsDashboardRoute } from "@ui/containers/pages/claims/dashboard.page";
import { ClaimSummaryRoute } from "@ui/containers/pages/claims/summary.page";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";

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
