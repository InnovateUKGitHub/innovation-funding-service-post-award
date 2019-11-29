import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IFormButton, StandardFormHandlerBase } from "./formHandlerBase";
import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "../features/forecastDetails";
import { GetByIdQuery } from "../features/projects";
import { ForecastDetailsDtosValidator } from "../../ui/validators";
import { getForecastDetailsEditor } from "../../ui/redux/selectors";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";
import { Params, UpdateForecastRoute } from "@ui/containers/forecasts/update";
import { ForecastDetailsRoute } from "@ui/containers/forecasts/details";

export class UpdateForecastFormHandler extends StandardFormHandlerBase<Params, "forecastDetails"> {
  constructor() {
    super(UpdateForecastRoute, ["default"], "forecastDetails");
  }
  protected async getDto(context: IContext, params: Params, button: IFormButton, body: { [key: string]: string; }): Promise<ForecastDetailsDTO[]> {
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

  protected async run(context: IContext, params: Params, button: IFormButton, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    await context.runCommand(new UpdateForecastDetailsCommand(params.projectId, params.partnerId, dto, false));
    return ForecastDetailsRoute.getLink(params);
  }

  protected getStoreKey(params: Params) {
    return getForecastDetailsEditor(params.partnerId).key;
  }

  protected createValidationResult(params: Params, dto: ForecastDetailsDTO[]) {
    return new ForecastDetailsDtosValidator(dto, [], [], [], false);
  }
}
