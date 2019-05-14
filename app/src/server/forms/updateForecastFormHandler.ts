import { Params as ForecastParams } from "../../ui/containers/claims/forecasts/common";
import { FormHandlerBase, IFormButton } from "./formHandlerBase";
import { Results } from "../../ui/validation/results";
import { GetAllForecastsForPartnerQuery, UpdateForecastDetailsCommand } from "../features/forecastDetails";
import { GetByIdQuery } from "../features/projects";
import { UpdateForecastRoute, ViewForecastRoute } from "../../ui/containers";
import { getForecastDetailsEditor } from "../../ui/redux/selectors";
import { ForecastDetailsDtosValidator } from "../../ui/validators";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IContext } from "@framework/types/IContext";
import { GetByIdQuery as GetPartnerByIdQuery } from "../features/partners";
import { GetCostCategoriesForPartnerQuery } from "../features/claims/getCostCategoriesForPartnerQuery";

export class UpdateForecastFormHandler extends FormHandlerBase<ForecastParams, ForecastDetailsDTO[]> {
  constructor() {
    super(UpdateForecastRoute, ["default"]);
  }
  protected async getDto(context: IContext, params: ForecastParams, button: IFormButton, body: { [key: string]: string; }): Promise<ForecastDetailsDTO[]> {
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

  protected async run(context: IContext, params: ForecastParams, button: IFormButton, dto: ForecastDetailsDTO[]): Promise<ILinkInfo> {
    await context.runCommand(new UpdateForecastDetailsCommand(params.projectId, params.partnerId, dto, false));
    return ViewForecastRoute.getLink(params);
}

  protected getStoreInfo(params: ForecastParams): { key: string; store: string; } {
    return getForecastDetailsEditor(params.partnerId);
  }

  protected createValidationResult(params: ForecastParams, dto: ForecastDetailsDTO[]): Results<ForecastDetailsDTO[]> {
    return new ForecastDetailsDtosValidator (dto, [], [], [], false);
  }
}
