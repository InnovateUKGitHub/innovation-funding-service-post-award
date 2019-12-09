import { IFormBody, IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { AllClaimsDashboardRoute, ClaimForecastParams, ClaimForecastRoute, ClaimsDashboardRoute, PrepareClaimRoute } from "../../ui/containers";
import { ForecastDetailsDtosValidator } from "../../ui/validators";
import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "../features/forecastDetails";
import { GetAllProjectRolesForUser, GetByIdQuery } from "../features/projects";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { IContext, ILinkInfo, ProjectRole } from "@framework/types";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";
import { storeKeys } from "@ui/redux/stores/storeKeys";

export class ClaimForecastFormHandler extends StandardFormHandlerBase<ClaimForecastParams, "forecastDetails"> {
  constructor() {
    super(ClaimForecastRoute, ["save", "default"], "forecastDetails");
  }

  protected async getDto(context: IContext, params: ClaimForecastParams, button: IFormButton, body: IFormBody): Promise<ForecastDetailsDTO[]> {
    const dto = await context.runQuery(new GetAllForecastsForPartnerQuery(params.partnerId));
    const project = await context.runQuery(new GetByIdQuery(params.projectId));
    const partner = await context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(project, partner));

    const costCategoriesIdsToUpdate = costCategories
      .filter(x => !x.isCalculated)
      .map(x => x.id);

    dto.forEach(x => {
      if (x.periodId > project.periodId && costCategoriesIdsToUpdate.indexOf(x.costCategoryId) >= 0) {
        x.value = parseFloat(body[`value_${x.periodId}_${x.costCategoryId}`]);
      }
    });

    return dto;
  }

  protected async run(context: IContext, params: ClaimForecastParams, button: IFormButton, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    const submit = button.name === "default";
    await context.runCommand(new UpdateForecastDetailsCommand(params.projectId, params.partnerId, dto, submit));

    if (button.name === "save") {
      return PrepareClaimRoute.getLink(params);
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
    return new ForecastDetailsDtosValidator(dto, [], [], [], false);
  }

}
