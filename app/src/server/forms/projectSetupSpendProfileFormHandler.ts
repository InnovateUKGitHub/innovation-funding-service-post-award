import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { UpdateInitialForecastDetailsCommand } from "../features/forecastDetails";
import { GetByIdQuery } from "../features/projects";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";
import { Params } from "@ui/containers/forecasts/update";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ProjectSetupRoute, ProjectSetupSpendProfileParams, ProjectSetupSpendProfileRoute } from "@ui/containers";
import { GetAllInitialForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllInitialForecastsForPartnerQuery";
import { InitialForecastDetailsDtosValidator } from "@ui/validators/initialForecastDetailsDtosValidator";

export class ProjectSetupSpendProfileFormHandler extends StandardFormHandlerBase<ProjectSetupSpendProfileParams, "initialForecastDetails"> {
  constructor() {
    super(ProjectSetupSpendProfileRoute, ["default"], "initialForecastDetails");
  }
  protected async getDto(context: IContext, params: Params, button: IFormButton, body: { [key: string]: string; }): Promise<ForecastDetailsDTO[]> {
    const dto = await context.runQuery(new GetAllInitialForecastsForPartnerQuery(params.partnerId));
    const project = await context.runQuery(new GetByIdQuery(params.projectId));
    const partner = await context.runQuery(new GetPartnerByIdQuery(params.partnerId));
    const costCategories = await context.runQuery(new GetCostCategoriesForPartnerQuery(project, partner));

    const costCategoriesIdsToUpdate = costCategories
      .filter(x => !x.isCalculated)
      .map(x => x.id);

    dto.forEach(x => {
      if (costCategoriesIdsToUpdate.indexOf(x.costCategoryId) >= 0) {
        x.value = parseFloat(body[`value_${x.periodId}_${x.costCategoryId}`]);
      }
    });

    return dto;
  }

  protected async run(context: IContext, params: Params, button: IFormButton, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    // TODO handle submit
    await context.runCommand(new UpdateInitialForecastDetailsCommand(params.projectId, params.partnerId, dto, false));
    return ProjectSetupRoute.getLink(params);
  }

  protected getStoreKey(params: Params) {
    return storeKeys.getPartnerKey(params.partnerId);
  }

  protected createValidationResult(params: Params, dto: ForecastDetailsDTO[]) {
    return new InitialForecastDetailsDtosValidator(dto, [], [], false, false);
  }
}
