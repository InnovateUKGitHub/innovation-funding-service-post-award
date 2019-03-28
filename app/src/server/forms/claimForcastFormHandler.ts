import { FormHandlerBase, IFormBody, IFormButton } from "./formHandlerBase";
import { Results } from "../../ui/validation/results";
import { AllClaimsDashboardRoute, ClaimForcastParams, ClaimForecastRoute, ClaimsDashboardRoute, PrepareClaimRoute } from "../../ui/containers";
import { getForecastDetailsEditor } from "../../ui/redux/selectors";
import { ForecastDetailsDtosValidator } from "../../ui/validators";
import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "../features/forecastDetails";
import { GetAllProjectRolesForUser, GetByIdQuery } from "../features/projects";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { IContext, ILinkInfo, ProjectRole } from "../../types";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";

export class ClaimForcastFormHandler extends FormHandlerBase<ClaimForcastParams, ForecastDetailsDTO[]> {
  constructor() {
    super(ClaimForecastRoute, ["save", "default"]);
  }

  protected async getDto(context: IContext, params: ClaimForcastParams, button: IFormButton, body: IFormBody): Promise<ForecastDetailsDTO[]> {
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

  protected async run(context: IContext, params: ClaimForcastParams, button: IFormButton, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    const submit = button.name === "default";
    await context.runCommand(new UpdateForecastDetailsCommand(params.projectId, params.partnerId, dto, submit));

    if (button.name === "save") {
      return PrepareClaimRoute.getLink(params);
    }

    // if pm as well as fc then go to all claims route
    const roles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.for(params.projectId, params.partnerId));
    if (roles.hasRole(ProjectRole.ProjectManager)) {
      return AllClaimsDashboardRoute.getLink(params);
    }

    return ClaimsDashboardRoute.getLink(params);

  }

  protected getStoreInfo(params: ClaimForcastParams): { key: string; store: string; } {
    return getForecastDetailsEditor(params.partnerId);
  }

  protected createValidationResult(params: ClaimForcastParams, dto: ForecastDetailsDTO[]): Results<ForecastDetailsDTO[]> {
    return new ForecastDetailsDtosValidator(dto, [], [], [], false);
  }

}
